(function() {

  var $  = document.getElementById.bind(document);
  var $$ = document.querySelectorAll.bind(document);

  var App = function($el){
    this.$el = $el;
    this.load();

    this.$el.addEventListener(
      'submit', this.submit.bind(this)
    );

    if (this.dob) {
      this.renderAgeLoop();
    } else {
      this.renderChoose();
    }
  };

  App.fn = App.prototype;

  App.fn.load = function(){
    var value;

    if (value = localStorage.getItem('dob'))
      this.dob = new Date(parseInt(value, 10));

    // Load the background color from localStorage and apply it
    var bgColor = localStorage.getItem('bgcolor');
    if (bgColor) {
      this.applyBgColor(bgColor);
    }
  };

  App.fn.save = function(){
    if (this.dob)
      localStorage.setItem('dob', this.dob.getTime());

    // Save the background color when the form is submitted
    var colorInput = $('bgcolor');
    if (colorInput && colorInput.value) {
      localStorage.setItem('bgcolor', colorInput.value);
      this.applyBgColor(colorInput.value);
    }
  };

  App.fn.submit = function(e){
    e.preventDefault();

    var DateOfBirthInput = $('dob');

    if (DateOfBirthInput && DateOfBirthInput.valueAsDate) {
      this.dob = DateOfBirthInput.valueAsDate;
      this.save();
      this.renderAgeLoop();
    }
  };

  // Function to apply the background color
  App.fn.applyBgColor = function(color) {
    document.body.style.backgroundColor = color;
  };

  App.fn.renderChoose = function(){
    this.html(this.view('dob'));
  };

  App.fn.renderAgeLoop = function(){
    if(this.interval) clearInterval(this.interval);
    this.interval = setInterval(this.renderAge.bind(this), 100);
  };

  App.fn.renderAge = function(){
    var now = new Date();
    var duration = now - this.dob;
    var years = duration / 31556900000;

    var majorMinor = years.toFixed(9).split('.');

    requestAnimationFrame(function(){
      this.html(this.view('age', {
        year: majorMinor[0],
        milliseconds: majorMinor[1]
      }));
    }.bind(this));
  };

  App.fn.$$ = function(sel){
    return this.$el.querySelectorAll(sel);
  };

  App.fn.html = function(html){
    this.$el.innerHTML = html;
  };

  App.fn.view = function(name, data){
    var $el = $(name + '-template');
    var template = $el.innerHTML;

    return template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
      return data && data.hasOwnProperty(key) ? data[key] : '';
    });
  };

  window.app = new App($('app'));

})();
