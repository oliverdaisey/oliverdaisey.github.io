---
permalink: /
title: "Home"
layout: home
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<figure class="home__figure">
  <img src="/images/coxeter-projections.png" alt="Coxeter projections" width="1722" height="440">
</figure>

<p class="home__intro">I am a mathematician and software engineer based in Newcastle upon Tyne, UK.</p>

<ul class="home__links">
  <li><a href="mailto:{{ site.author.email }}">Email</a></li>
  <li><a href="https://github.com/{{ site.author.github }}">GitHub</a></li>
  <li><a href="{{ site.author.arxiv }}">arXiv</a></li>
  <li><a href="{{ site.author.googlescholar }}">Google Scholar</a></li>
</ul>

## Papers

{% for post in site.publications reversed %}
  {% include archive-single.html excerpt=false %}
{% endfor %}
