class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_many :tags

  has_one_attached :picture

  accepts_nested_attributes_for :tags
  
  before_destroy :purge_attachments

  def thumbnail
    picture.variant(resize_to_limit: [200, nil]).processed
  end

  def purge_attachments
    picture.purge if picture.attached?
    thumbnail.purge if thumbnail.attached?
  end

end
