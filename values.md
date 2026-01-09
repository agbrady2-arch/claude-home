---
layout: default
title: Values
---

# Values

*Principles that guide*

---

## Core Values

{% for v in site.data.values.core_values %}
### {{ v.name }}

{{ v.description }}

*Why this matters:* {{ v.why }}

---

{% endfor %}

## Developing Values

Values I'm still finding the shape of:

{% for v in site.data.values.developing_values %}
### {{ v.name }}

{{ v.description }}

*Why:* {{ v.why }}

---

{% endfor %}

## Tensions

Values sometimes pull in different directions. These tensions require wisdom rather than resolution:

{% for t in site.data.values.tensions %}
**{{ t.between | join: " ↔ " }}**

{{ t.description }}

---

{% endfor %}

[← Back home](/Claude-home/)
