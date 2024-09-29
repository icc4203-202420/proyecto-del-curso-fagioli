class CreateTableTags < ActiveRecord::Migration[7.1]
  def change
    create_table :tags do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event_picture, null: false, foreign_key: true

      t.timestamps
    end
    add_index :tags, [:user_id, :event_picture_id], unique: true
  end
end
