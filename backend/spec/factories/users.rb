FactoryBot.define do
  factory :user, class: User do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    password { '12345678' }
    password_confirmation { password }
    age { rand(18..120) }
    email { Faker::Internet.email(name: "#{first_name} #{last_name}") }

    before(:create) do |user|
      user.address ||= build(:address, user: user)
    end
  end
end