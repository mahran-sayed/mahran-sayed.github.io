/* Tiny dependency-free Markdown renderer.
   Supports: headings, paragraphs, bold/italic/strike, inline code, fenced code,
   links, images, lists (nested), tables, blockquotes, hr, raw HTML blocks,
   $inline$ and $$display$$ math (rendered by KaTeX if present), and smart media:
     ![caption](file.pdf)                    -> embedded PDF viewer
     ![caption](https://drive.google.com/file/d/ID/view)   -> Drive preview
     ![caption](https://docs.google.com/presentation/...)  -> Slides embed
     ![caption](https://youtu.be/ID)         -> YouTube embed
     ![caption](clip.mp4)                    -> video
     ![caption](figure.svg)                  -> image with caption
*/
(function (global) {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function slugify(s) {
    return s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  }

  function isAbs(u) { return /^(https?:|mailto:|tel:|#|\/|data:)/i.test(u); }

  function Renderer(base) {
    this.base = base || "";
    this.stash = [];
  }

  Renderer.prototype.hold = function (html) {
    this.stash.push(html);
    return "\u0000" + (this.stash.length - 1) + "\u0000";
  };

  Renderer.prototype.restore = function (s) {
    var self = this;
    var prev;
    do {
      prev = s;
      s = s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return self.stash[+i]; });
    } while (s !== prev && /\u0000\d+\u0000/.test(s));
    return s;
  };

  Renderer.prototype.url = function (u) {
    u = (u || "").trim();
    if (/^\s*javascript:/i.test(u)) return "#";
    if (isAbs(u)) return u;
    return this.base + u;
  };

  Renderer.prototype.media = function (alt, rawUrl, block) {
    var u = this.url(rawUrl);
    var cap = alt ? "<figcaption>" + esc(alt) + "</figcaption>" : "";
    var m;
    if (/\.pdf($|[?#])/i.test(rawUrl)) {
      return '<figure class="embed embed-pdf"><iframe class="pdf-frame" src="' + esc(u) + '" title="' + esc(alt || "PDF") + '" loading="lazy"></iframe>' +
        '<figcaption><a href="' + esc(u) + '" target="_blank" rel="noopener">Open or download the PDF</a>' + (alt ? " &middot; " + esc(alt) : "") + "</figcaption></figure>";
    }
    if ((m = rawUrl.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) {
      return '<figure class="embed embed-doc"><iframe src="https://drive.google.com/file/d/' + m[1] + '/preview" title="' + esc(alt || "Document") + '" allow="autoplay" loading="lazy"></iframe>' +
        '<figcaption><a href="https://drive.google.com/file/d/' + m[1] + '/view" target="_blank" rel="noopener">Open in Google Drive</a>' + (alt ? " &middot; " + esc(alt) : "") + "</figcaption></figure>";
    }
    if (/docs\.google\.com\/(presentation|document)/.test(rawUrl)) {
      return '<figure class="embed embed-doc"><iframe src="' + esc(u) + '" title="' + esc(alt || "Slides") + '" allowfullscreen loading="lazy"></iframe>' + cap + "</figure>";
    }
    if ((m = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/))) {
      return '<figure class="embed embed-video"><iframe src="https://www.youtube-nocookie.com/embed/' + m[1] + '" title="' + esc(alt || "Video") + '" allowfullscreen loading="lazy"></iframe>' + cap + "</figure>";
    }
    if (/\.(mp4|webm|ogg)($|[?#])/i.test(rawUrl)) {
      return '<figure class="embed embed-video"><video controls preload="metadata" src="' + esc(u) + '"></video>' + cap + "</figure>";
    }
    var img = '<img src="' + esc(u) + '" alt="' + esc(alt) + '" loading="lazy">';
    return block ? "<figure>" + img + cap + "</figure>" : img;
  };

  Renderer.prototype.inline = function (s) {
    var self = this;
    s = esc(s);
    // allow a few harmless inline tags
    s = s.replace(/&lt;(\/?)(br|kbd|sub|sup|b|i|em|strong|mark|small|u)\s*\/?&gt;/gi, "<$1$2>");
    // images
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, function (_, alt, url) {
      return self.hold(self.media(alt.replace(/&amp;/g, "&"), url.replace(/&amp;/g, "&"), false));
    });
    // links
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, function (_, text, url) {
      url = url.replace(/&amp;/g, "&");
      var u = self.url(url);
      var ext = /^https?:/i.test(u);
      return self.hold('<a href="' + esc(u) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">") + text + self.hold("</a>");
    });
    // autolinks
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, function (_, pre, url) {
      return pre + self.hold('<a href="' + url + '" target="_blank" rel="noopener">') + url + self.hold("</a>");
    });
    // emphasis
    s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\w])__([^_]+?)__(?!\w)/g, "$1<strong>$2</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[^\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/~~([^~]+?)~~/g, "<del>$1</del>");
    s = s.replace(/ {2,}\n/g, "<br>\n");
    return s;
  };

  Renderer.prototype.blocks = function (lines) {
    var out = [];
    var i = 0;
    var self = this;

    function flushPara(buf) {
      if (!buf.length) return;
      var text = buf.join("\n");
      var m = text.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
      if (m) out.push(self.media(m[1], m[2], true));
      else out.push("<p>" + self.inline(text) + "</p>");
    }

    function indentOf(l) { return l.match(/^\s*/)[0].replace(/\t/g, "    ").length; }
    var LI = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

    function parseList(start) {
      var first = lines[start].match(LI);
      var base = indentOf(lines[start]);
      var ordered = /\d/.test(first[2]);
      var items = [];
      var j = start;
      while (j < lines.length) {
        var l = lines[j];
        if (!l.trim()) {
          // blank line: continue list only if next non-blank is a list item/indented
          var k = j + 1;
          while (k < lines.length && !lines[k].trim()) k++;
          if (k < lines.length && (indentOf(lines[k]) > base || (LI.test(lines[k]) && indentOf(lines[k]) === base))) { j = k; continue; }
          break;
        }
        var ind = indentOf(l);
        var m = l.match(LI);
        if (ind === base && m) {
          items.push({ text: [m[3]], sub: [] });
          j++;
        } else if (ind > base && items.length) {
          if (LI.test(l)) items[items.length - 1].sub.push(l.slice(Math.min(ind, base + 2)));
          else items[items.length - 1].text.push(l.trim());
          j++;
        } else if (ind < base || m) {
          break;
        } else if (items.length && ind >= base) {
          items[items.length - 1].text.push(l.trim()); j++;
        } else break;
      }
      var tag = ordered ? "ol" : "ul";
      var html = "<" + tag + ">" + items.map(function (it) {
        var inner = self.inline(it.text.join(" "));
        if (it.sub.length) inner += self.blocks(it.sub);
        return "<li>" + inner + "</li>";
      }).join("") + "</" + tag + ">";
      return { html: html, next: j };
    }

    var para = [];
    while (i < lines.length) {
      var line = lines[i];
      var t = line.trim();
      var m;

      if (!t) { flushPara(para); para = []; i++; continue; }

      // raw stash line (code block / display math)
      if (/^\u0000\d+\u0000$/.test(t)) { flushPara(para); para = []; out.push(t); i++; continue; }

      if ((m = t.match(/^(#{1,6})\s+(.*?)\s*#*$/))) {
        flushPara(para); para = [];
        var lvl = m[1].length;
        var inner = self.inline(m[2]);
        out.push("<h" + lvl + ' id="' + slugify(m[2]) + '">' + inner + "</h" + lvl + ">");
        i++; continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { flushPara(para); para = []; out.push("<hr>"); i++; continue; }

      if (t.charAt(0) === ">") {
        flushPara(para); para = [];
        var q = [];
        while (i < lines.length && lines[i].trim().charAt(0) === ">") { q.push(lines[i].trim().replace(/^>\s?/, "")); i++; }
        out.push("<blockquote>" + self.blocks(q) + "</blockquote>");
        continue;
      }

      // table
      if (t.indexOf("|") > -1 && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
        flushPara(para); para = [];
        var cells = function (r) { return r.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); }); };
        var head = cells(line);
        var aligns = cells(lines[i + 1]).map(function (c) { return /^:-+:$/.test(c) ? "center" : /-:$/.test(c) ? "right" : ""; });
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].trim() && lines[i].indexOf("|") > -1) { rows.push(cells(lines[i])); i++; }
        var td = function (tag, c, k) { return "<" + tag + (aligns[k] ? ' style="text-align:' + aligns[k] + '"' : "") + ">" + self.inline(c) + "</" + tag + ">"; };
        out.push('<div class="table-wrap"><table><thead><tr>' + head.map(function (c, k) { return td("th", c, k); }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + r.map(function (c, k) { return td("td", c, k); }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }

      if (LI.test(line)) {
        flushPara(para); para = [];
        var res = parseList(i);
        out.push(res.html); i = res.next; continue;
      }

      // raw html block
      if (/^<(div|iframe|figure|details|summary|section|video|audio|table|p|a|img|span|br|center|svg|style)\b/i.test(t) && !para.length) {
        var h = [];
        while (i < lines.length && lines[i].trim()) { h.push(lines[i]); i++; }
        out.push(h.join("\n"));
        continue;
      }

      para.push(line);
      i++;
    }
    flushPara(para);
    return out.join("\n");
  };

  Renderer.prototype.render = function (md) {
    var self = this;
    md = String(md).replace(/\r\n?/g, "\n").replace(/^---\n[\s\S]*?\n---\n/, ""); // drop optional front-matter
    // fenced code
    md = md.replace(/^```([\w+-]*)[^\n]*\n([\s\S]*?)\n```[ \t]*$/gm, function (_, lang, code) {
      return self.hold('<pre><code' + (lang ? ' class="lang-' + esc(lang) + '"' : "") + ">" + esc(code) + "</code></pre>");
    });
    // inline code
    md = md.replace(/`([^`\n]+)`/g, function (_, c) { return self.hold("<code>" + esc(c) + "</code>"); });
    // display math
    md = md.replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) { return self.hold('<div class="math">$$' + esc(tex.trim()) + "$$</div>"); });
    // inline math
    md = md.replace(/(^|[^\\$\w])\$([^\s$](?:[^$\n]*?[^\s$\\])?)\$(?![\w$])/g, function (_, pre, tex) {
      return pre + self.hold('<span class="math">$' + esc(tex) + "$</span>");
    });
    var html = self.blocks(md.split("\n"));
    return self.restore(html);
  };

  global.MD = {
    render: function (md, base) { return new Renderer(base).render(md); },
    esc: esc,
  };
})(window);
