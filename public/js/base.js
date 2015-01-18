"use strict";

var app;

function CarriageCtrl(view) {
  this.view = new view(),
  this.article_data = null;

  this.getArticleJSON = function(cb) {
    $.getJSON('js/mock_data.json')
     .done(cb)
  }

  this.init = function() {
    var self = this;
    this.getArticleJSON(function(data){
      self.article_data = data.article;
      self.view.render(self.article_data);
    })
  }

  return this;

}

function carriageView() {

  this.render = function(article){
    var n = article.sentence.length
    for(var i=0; i<n; i++){
      this.buildSentence(article.sentence[i])
    }
  }

  this.buildSentence = function(sentence) {
    $('#container').append(sentence.text)
  }

  return this;

}


$(document).ready(function(){
  
  app = new CarriageCtrl( carriageView )
  app.init()

})
