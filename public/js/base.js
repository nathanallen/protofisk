"use strict";

var app;

function ArticleModel() {
  var self = this;
  this.article_data = null;
  // this.title = article.title

  this.getArticleJSON = function(cb) {
    $.getJSON('js/mock_data.json')
     .done(function(data){
        cb(self.save(data.article))
    })
  }

  this.save = function(article, cb) {
    self.title = article.title
    self.author = article.author
    self.publisher = article.publisher 
    self.date_published = article.date_published
    self.original_url = article.original_url
    self.title = article.title
    self.sentence = article.sentence
    return self
  }

  this.sentenceGenerator = function* () {
    var n = this.sentence.length
    for(var i=0; i<n; i++) {
      yield self.sentence[i];
    }
  }

  return this;
}

function CarriageCtrl(view, model) {
  this.view = new view()
  this.model = new model()
  this.article_data = null;

  this.init = function() {
    var self = this;
    this.model.getArticleJSON(function(_){
      self.view.render(self.model)
    })
  }

  return this;

}

function CarriageView() {
  var self = this;
  var sentence_tmpl = $('#sentence-tmpl').html()

  this.render = function(articleModel){
    // render article metadata
    $('#container').append(articleModel.title)
    $('#container').append(articleModel.author)

    // render sentences
    var new_elements = []
    var sentenceIter = articleModel.sentenceGenerator()
    var next = sentenceIter.next()
    while (!next.done) {
      var $el = $(self.buildSentence(next.value))
      new_elements.push(
        bindListeners($el, next.value)
      )
      next = sentenceIter.next()
    }
    $('#container').append(new_elements)

  }

  this.buildSentence = function(sentence) {
    return render(sentence_tmpl, sentence)
  }

  function bindListeners($el, self) {
    return $el.click(function(){
      $el = this;
      self.text += "!"
      $el.innerText = self.text
    })
  }

  return this;

}


//*******************************************
// THIRD PARTY
//*******************************************

// render function modified from riot.js framework
var template_escape = {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"}

function render(tmpl, data, escape_fn) {
  tmpl = tmpl || '';
  return ( new Function("_", "e", "return '" +
    tmpl.replace(/[\\\n\r']/g, function(char) {
      return template_escape[char];
    }).replace(/{{\s*([\w\d\.]+)\s*}}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'")
  )(data, escape_fn);
};


//*******************************************


$(document).ready(function(){
  
  app = new CarriageCtrl( CarriageView, ArticleModel )
  app.init()

})
