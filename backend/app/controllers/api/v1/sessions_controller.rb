require_relative '../../../services/push_notification_service'

class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json

  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    if params[:user][:push_token].present?
      resource.update(push_token: params[:user][:push_token])
    end
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  private
  def respond_with(current_user, _opts = {})
    PushNotificationService.send_notification(
      to: current_user.push_token,
      title: 'Logged in status',
      body: 'The operation was successful',
      data: {}
    )
    render json: {
      status: { 
        code: 200, message: 'Logged in successfully.',
        data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
      }
    }, status: :ok
  end
  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(
        request.headers['Authorization'].split(' ').last,
        Rails.application.credentials.devise_jwt_secret_key,
        true,
        { algorithm: 'HS256' }
      ).first
      current_user = User.find(jwt_payload['sub'])
    end
    
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
