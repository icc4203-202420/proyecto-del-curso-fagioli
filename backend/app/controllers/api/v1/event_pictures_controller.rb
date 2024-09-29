class API::V1::EventPicturesController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  
  before_action :verify_jwt_token, only: [:index, :create]

  def index
    @event = Event.find(params[:event_id])
    @event_pics_raw = @event.event_pictures
    @event_pics = @event_pics_raw.map do |ep|
      if ep.picture.attached?
        ep.as_json.merge(
          image_url: url_for(ep.picture),
          thumbnail_url: url_for(ep.thumbnail),
          handle: ep.user.handle,
          tags: ep.tags.map do |tag|
            tag.as_json.merge(handle: tag.user.handle)
          end
        )
      end
    end
    render json: { event_pictures: @event_pics }, status: :ok
  end

  def create
    @event_pic = EventPicture.new(event_picture_params.except(:image_base64))
    handle_image_attachment if event_picture_params[:image_base64]

    if @event_pic.save
      render json: { event: @event_pic, message: 'Event picture created successfully.' }, status: :ok
    else
      render json: @event_pic.errors, status: :unprocessable_entity
    end
  end

  private

  def event_picture_params
    params.require(:event_picture).permit(
      :event_id, :user_id, :image_base64
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_picture_params[:image_base64])
    @event_pic.picture.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end