class API::V1::ReviewsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_parent, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    # @reviews = Review.where(user: @user)
    if @parent
      @reviews = @parent.reviews
    else
      @reviews = Review.all
    end
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @parent.reviews.build(review_params.merge(user_id: current_user.id))
    if @review.save
      current_user.friends.each do |friend| 
        FeedChannel.broadcast_to(friend, { 
          message: "hello from rails dude, #{friend.handle}", 
          type: 'review', 
          resource: @review.as_json.merge(
            publication_type: "review", 
            handle: User.find(@review.user_id).handle, 
            beer_name: Beer.find(@review.beer_id).name,
            bar_name: Beer.find(@review.beer_id).bars&.first&.name,
            bar_address: Beer.find(@review.beer_id).bars&.first&.address,
            country: Beer.find(@review.beer_id).bars&.first&.address&.country&.name
          )
        })
      end
      # FeedChannel.broadcast_to(current_user, { message: "hello from rails dude, #{current_user.handle}", type: 'review', resource: @review.as_json })
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_parent
    if params[:user_id]
      @parent = User.find(params[:user_id])
    elsif params[:beer_id]
      @parent = Beer.find(params[:beer_id])
    end
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
