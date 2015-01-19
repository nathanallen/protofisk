"use strict";

var app;

function ArticleModel() {
  this.article_data = null;
  // this.title = article.title

  this.getArticleJSON = function(cb) {
    var self = this;
    $.getJSON('js/mock_data.json')
     .done(function(data){
      self.article_data = data.article;
      cb(data.article)
    })
  }

  return this;
}

function CarriageCtrl(view, model) {
  this.view = new view(),
  this.model = new model(),
  this.article_data = null;

  this.init = function() {
    var self = this;
    this.model.getArticleJSON(self.view.render)
  }

  return this;

}

function CarriageView() {
  var self = this;

  this.render = function(article){
    var n = article.sentence.length
    for(var i=0; i<n; i++){
      self.buildSentence(article.sentence[i])
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
