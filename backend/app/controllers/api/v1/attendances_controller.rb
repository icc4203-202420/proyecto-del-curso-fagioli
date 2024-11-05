require_relative '../../../services/push_notification_service'

class API::V1::AttendancesController < ApplicationController
  include Authenticable
  respond_to :json

  def index
    @attendances = Attendance.find_by(event_id: params[:event_id])
    render json: { attendances: @attendances }, status: :ok
  end

  def create
    att_params = params.require(:attendance).permit(:event_id)
    @attendance = Attendance.new(att_params.merge(user_id: current_user.id))
    puts "\n\n params: #{att_params} \n\n"
    puts "\n\n attendace: #{@attendance} \n\n"
    if @attendance.save
      @event = Event.find(att_params[:event_id])
      @bar = Bar.find(@event.bar_id)
      current_user.friends.map do |friend|
        PushNotificationService.send_notification(
          to: friend.push_token,
          title: "#{current_user.handle} asiste a un nuevo evento",
          body: "#{@event.name} en #{@bar.name}",
          data: { situation: 'attendance to event', bar_id: @bar.id, bar_name: @bar.name }
        )
      end
      render json: { attendance: @attendance, message: 'Attendance created successfully.' }, status: :ok
      else
      render json: @attendance.errors, status: :unprocessable_entity
    end
  end

end