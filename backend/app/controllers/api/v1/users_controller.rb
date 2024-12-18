class API::V1::UsersController < ApplicationController
  include Authenticable
  
  respond_to :json
  before_action :set_user, only: [:show, :update]
  before_action :verify_jwt_token, only: [:index]  
  
  def index
    @users_raw = User.includes(:reviews, :address).all
    @users = @users_raw.map do |user|
      user.as_json.merge(is_friend: current_user.friends.include?(user))
    end
    # current_user.friends.each { |friend| FeedChannel.broadcast_to(friend, { message: "hello from rails dude, #{friend.handle}", type: 'mess', resource: @users.as_json }) }
    # FeedChannel.broadcast_to(current_user, { message: 'hello from rails myself', type: 'mess', resource: @users.as_json })
    render json: { users: @users }, status: :ok
  end

  def show
  
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
