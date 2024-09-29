class API::V1::TagsController < ApplicationController
  include Authenticable

  respond_to :json
  
  before_action :verify_jwt_token, only: [:create]

  def create
    @tag = Tag.new(tag_params)

    if @tag.save
      render json: { tag: @tag, message: 'Tag created successfully.' }, status: :ok
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:user_id, :event_picture_id)
  end
end