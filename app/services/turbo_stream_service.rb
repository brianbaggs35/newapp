class TurboStreamService
  def initialize
    @turbo_streams = []
  end

  def update(target, content)
    @turbo_streams << turbo_stream.update(target, content)
    self
  end

  def append(target, content)
    @turbo_streams << turbo_stream.append(target, content)
    self
  end

  def prepend(target, content)
    @turbo_streams << turbo_stream.prepend(target, content)
    self
  end

  def replace(target, content)
    @turbo_streams << turbo_stream.replace(target, content)
    self
  end

  def remove(target)
    @turbo_streams << turbo_stream.remove(target)
    self
  end

  def render
    @turbo_streams.join
  end

  private

  def turbo_stream
    @turbo_stream ||= ActionController::Live::SSE.new(StringIO.new)
  end
end