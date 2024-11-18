require_relative '../../../services/push_notification_service'

class API::V1::TagsController < ApplicationController
  include Authenticable

  respond_to :json
  
  before_action :verify_jwt_token, only: [:create]

  def create
    @tag = Tag.new(tag_params)

    if @tag.save
      PushNotificationService.send_notification(
        to: User.find(tag_params[:user_id]).push_token,
        title: "#{current_user.handle} te ha etiquetado en una fotografía",
        body: "Presiona para ver la imagen",
        data: { situation: 'create a tag', bar_id: @tag.event_picture.event.bar.id, event_id: @tag.event_picture.event.id }
      )
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