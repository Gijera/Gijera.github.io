module Jekyll

  class CalendarPage < Page
    def initialize(site, base, dir, calendar)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_index.html')
      self.data['calendar'] = calendar
      self.data['title'] = calendar

      calendarPageContent = '{% include calendar-list.html %}'
      self.content = calendarPageContent
    end
  end

  class CalendarPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category_index'
        dir = 'calendar'
        site.posts.docs.each do |postItem|
          dateString = postItem.date.strftime("%Y-%m")
          site.pages << CalendarPage.new(site, site.source, File.join(dir, dateString), dateString)
        end
      end
    end
  end

end