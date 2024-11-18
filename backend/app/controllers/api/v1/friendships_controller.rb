require_relative '../../../services/push_notification_service'

class API::V1::FriendshipsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :verify_jwt_token, only: [:index, :create]
  before_action :set_user
  
  def index
    @friendships = @user.friendships
    render json: { friendships: @friendships }, status: :ok
  end

  def show
  
  end

  # def create
  #   @friendship = Friendship.new(friendship_params.merge(user_id: @user.id))
  #   if @friendship.save
  #     PushNotificationService.send_notification(
  #       to: User.find(friendship_params[:friend_id]).push_token,
  #       title: "#{@user.handle} te ha agregado como amigo",
  #       body: "Presiona para abrir la aplicación",
  #       data: { situation: 'create a friendship' }
  #     )
  #     render json: { friendship: @friendship, message: "Friendship done" }, status: :ok
  #   else
  #     render json: @friendship.errors, status: :unprocessable_entity
  #   end
  # end

  def create
    ActiveRecord::Base.transaction do
      @friendship = Friendship.create!(friendship_params.merge(user_id: @user.id, friend_id: current_user.id))
      inverse_friendship = Friendship.create!(friendship_params.merge(user_id: @friendship.friend_id, friend_id: @user.id))

      PushNotificationService.send_notification(
        to: User.find(@user.id).push_token,
        title: "#{current_user.handle} te ha agregado como amigo",
        body: "Presiona para abrir la aplicación",
        data: { situation: 'create a friendship' }
      )
    end
  
    render json: { friendship: @friendship, message: "Friendship done" }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors }, status: :unprocessable_entity
  end
  

  def update
      
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def friendship_params
    params.require(:friendship).permit(:bar_id, :event_id)
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
