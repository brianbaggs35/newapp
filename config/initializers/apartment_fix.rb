# Fix for Apartment gem middleware issue in Rails 8.x
# The Apartment gem adds middleware using a string instead of the actual class,
# which causes NoMethodError: undefined method `new' for "Apartment::Reloader":String

# Only apply this fix in development mode (same as the apartment gem does)
if Rails.env.development?

  # Patch the ActionDispatch::MiddlewareStack to handle string middleware names properly
  # This fixes the issue where Apartment gem passes a string instead of a class
  module ActionDispatch
    class MiddlewareStack
      class Middleware
        # Override the klass method to convert string class names to actual classes
        alias_method :original_klass, :klass

        def klass
          if @klass.is_a?(String) && @klass == "Apartment::Reloader"
            # Convert the string to the actual class
            Apartment::Reloader
          else
            original_klass
          end
        end
      end
    end
  end
end
