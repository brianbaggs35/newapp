class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!
  before_action :set_user, only: [ :show, :edit, :update, :destroy, :confirm ]

  def index
    @users = User.all.order(:email)
    render json: @users
  end

  def show
    render json: @user
  end

  def create
    @user = User.new(user_params)
    @user.skip_confirmation! if params[:user][:skip_confirmation]

    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end

  def confirm
    @user.confirm
    render json: @user
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    permitted_params = [:email]
    
    # Only allow role changes by admin users
    permitted_params << :role if current_user&.admin?
    
    params.require(:user).permit(permitted_params)
  end

  def ensure_admin!
    redirect_to root_path unless current_user&.admin?
  end
end
