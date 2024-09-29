class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:index, :create, :update, :destroy]

  def index
    if params[:bar_id]
      @bar = Bar.find(params[:bar_id])
      @eventos = @bar.events
      @events = @eventos.map do |event|
        if event.flyer.attached?
          event.as_json().merge(
            image_url: url_for(event.flyer),
            thumbnail_url: url_for(event.thumbnail),
            attendances: event.attendances.map do |attendance|
              attendance.as_json().merge(
                user_first_name: attendance.user.first_name,
                user_last_name: attendance.user.last_name,
                user_handle: attendance.user.handle,
                is_friend: attendance.user.friends.include?(current_user)
              )
            end
          )
        else
          event.as_json().merge(
            attendances: event.attendances.map do |attendance|
              attendance.as_json().merge(
                user_first_name: attendance.user.first_name,
                user_last_name: attendance.user.last_name,
                user_handle: attendance.user.handle,
                is_friend: attendance.user.friends.include?(current_user)
              )
            end
          )
        end
      end
      puts "\n\n#{current_user.id}, #{current_user.first_name}\n\n"
    else
      @events = Event.all#.map {|event| do puts event}
    end
    render json: { events: @events }, status: :ok
  end

  def show
    if @event.flyer.attached?
      render json: @event.as_json.merge({
        image_url: url_for(@event.flyer),
        thumbnail_url: url_for(@event.thumbnail) }),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # Método para eliminar un event existente
  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :image_base64, :bar_id, :start_date, :end_date
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.flyer.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end