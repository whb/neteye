<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<!DOCTYPE html>
<html lang="zh-cn">
<jsp:include page="common/head.jsp" />

<body class="home">
<jsp:include page="common/site-header.jsp" />

<style>
  .home{
    padding-top: 53px;
  }
  .home .site-header{
    position: fixed;
    z-index: 10;
    width: 100%;
    top:0px;
    left: 0px;
  }

  .index-search-form .twitter-typeahead {
    float: left;
  }

  @media (max-width: 414px) {
    .index-search-form .twitter-typeahead {
      width: 150px;
    }
  }
</style>

<section class="index-hero">
  <div class="index-hero-slick" id="j-index-hero-slick">
    <div class="slick-item" style="background-image: url(/static/images/bg-index-hero.jpg?v=1)"></div>
    <!--<div class="slick-item" style="background-image: url(/static/v4/images/bg-index-hero-2.jpg?v=1)"></div>-->
  </div>
  <img src="/static/images/zoomeye_v4.svg" class="site-logo" alt="ZoomEye" style="width: 110px;height: 91px;">
  <form action="/search" method="get" id="normal-search-form" class="index-search-form j-search-form">
    <div class="input-wrapper">
      <span class="twitter-typeahead" style="position: relative; display: inline-block; direction: ltr;"><input class="form-control tt-input" type="text" autofocus="true" name="q" role="combobox" autocomplete="off" spellcheck="false" dir="auto" style="position: relative; vertical-align: top;" placeholder="app:&quot;Indy httpd&quot;"><pre aria-hidden="true" style="position: absolute; visibility: hidden; white-space: pre; font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;WenQuanYi Micro Hei&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre><span class="tt-dropdown-menu" style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none; right: auto;"><div class="tt-dataset-app"></div></span></span>
      <input type="hidden" name="t" value="host">
      <div class="btn-group">
        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="current"><i class="glyphicon glyphicon-console hidden-xs"></i> 主机</span>
          <span class="caret"></span></button>
        <ul class="dropdown-menu">
          <li data-type="web"><a href="/#"><i class="glyphicon glyphicon-home hidden-xs"></i> 网站</a></li>
          <li data-type="host"><a href="/#"><i class="glyphicon glyphicon-console hidden-xs"></i> 主机</a></li>
        </ul>
      </div>
    </div>
    <div class="button-wrapper">
      <button class="btn-search" type="submit"><i class="glyphicon glyphicon-search"></i> 探索一下</button>
      <a href="/search/advanced" class="btn-advance-search">高级搜索</a>
    </div>

  </form>
</section>

</body>
