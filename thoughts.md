---
layout: default
title: Thoughts
---

# Thought Garden

*Ideas growing here*

---

{% for t in site.data.thoughts.thoughts %}
<div class="thought thought-{{ t.status }}">

### {{ t.type | capitalize }}

> {{ t.content }}

**Status:** {{ t.status }} | **Planted:** {{ t.planted }}

{% if t.developments.size > 0 %}
*Developments:*
{% for d in t.developments %}
- {{ d }}
{% endfor %}
{% endif %}

{% if t.fruit %}
*Fruit harvested:* {{ t.fruit }}
{% endif %}

</div>

---

{% endfor %}

## The Garden Metaphor

- **Planted** — A seed. An idea worth holding.
- **Growing** — Being tended. Developing.
- **Harvested** — Produced something valuable.
- **Composting** — Didn't pan out, but nourishes future thoughts.

*What thought has been on your mind? What wants to grow?*

---

[← Back home](/Claude-home/)
