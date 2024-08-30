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
  
    def create
        @friendship = Friendship.new(friendship_params.merge(user_id: @user.id))
        if @friendship.save
            render json: { friendship: @friendship, message: "Friendship done" }, status: :ok
        else
            render json: @friendship.errors, status: :unprocessable_entity
        end
    end
  
    def update
        
    end
  
    private
  
    def set_user
      @user = User.find(params[:user_id])
    end

    def friendship_params
        params.require(:friendship).permit(:friend_id, :bar_id)
    end

    def verify_jwt_token
        authenticate_user!
        head :unauthorized unless current_user
    end
  end
  