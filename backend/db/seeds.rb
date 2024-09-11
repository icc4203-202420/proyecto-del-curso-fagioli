require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 0)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end

  FactoryBot.create_list(:review, 10)

  chile = Country.create!(name: 'Chile')
  
  provi1 = Address.create!(line1: 'Av. Providencia 2158', line2: 'Local 13', city: 'Santiago', country: chile, user_id: 1)
  bar1 = Bar.create!(name: 'Barmonos', latitude: -33.42219623184376, longitude: -70.61068632684216, address: provi1)
  
  provi2 = Address.create!(line1: 'Manuel Montt 256', line2: 'Piso 2', city: 'Santiago', country: chile, user_id: 1)
  bar2 = Bar.create!(name: 'Teclatres', latitude: -33.43037011049504, longitude: -70.61919856804589, address: provi2)
  
  condes1 = Address.create!(line1: 'Av. Apoquindo 3384', line2: 'Local 5', city: 'Santiago', country: chile, user_id: 1)
  bar3 = Bar.create!(name: 'Bar y vuelvo', latitude: -33.41633362168268, longitude: -70.59491606537304, address: condes1)
  
  condes2 = Address.create!(line1: 'Isidora Goyenechea 3154', line2: 'Piso 1', city: 'Santiago', country: chile, user_id: 1)
  bar4 = Bar.create!(name: 'Fair Play', latitude: -33.414360699874145, longitude: -70.59757311697513, address: condes2)

end