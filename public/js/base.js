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

  this.render = function(articleModel){
    var sentenceIter = articleModel.sentenceGenerator()
    var next = sentenceIter.next()
    while (!next.done) {
      self.buildSentence(next.value)
      next = sentenceIter.next()
    }
  }

  this.buildSentence = function(sentence) {
    $('#container').append(sentence.text)
  }

  return this;

}


$(document).ready(function(){
  
  app = new CarriageCtrl( CarriageView, ArticleModel )
  app.init()

})
