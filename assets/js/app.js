(function () {
  'use strict';

  var data = window.RESULT_DATA;
  if (!data || !Array.isArray(data.students)) {
    console.error('RESULT_DATA পাওয়া যায়নি। assets/js/data.js ফাইলটি দেখুন।');
    return;
  }

  /* ---------- Helpers ---------- */
  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  function toBn(value) {
    return String(value).replace(/\d/g, function (d) { return BN_DIGITS[d]; });
  }

  var ORDINALS = { 1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম', 6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম' };
  function ordinal(n) {
    return ORDINALS[n] || (toBn(n) + 'তম');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isNum(v) { return typeof v === 'number' && !isNaN(v); }

  /* ---------- Ranking (মোট নাম্বার অনুযায়ী; সমান হলে একই স্থান) ---------- */
  function buildRanking(list) {
    var sorted = list.map(function (s, i) {
      return Object.assign({}, s, { _order: i });
    }).sort(function (a, b) {
      return (b.total - a.total) || (a._order - b._order);
    });

    sorted.forEach(function (s, i) {
      s.rank = (i > 0 && s.total === sorted[i - 1].total) ? sorted[i - 1].rank : i + 1;

      // ডেটা-এন্ট্রির ভুল ধরতে (শুধু কনসোলে সতর্কবার্তা)
      var sum = [s.chief, s.assistant, s.recitation, s.oral, s.behavior]
        .reduce(function (acc, v) { return acc + (isNum(v) ? v : 0); }, 0);
      if (sum !== s.total) {
        console.warn('মোট নাম্বার মিলছে না: ' + s.name + ' (যোগফল ' + sum + ', দেওয়া আছে ' + s.total + ')');
      }
    });
    return sorted;
  }

  var students = buildRanking(data.students);

  /* ---------- Rendering ---------- */
  function markCell(v) {
    if (isNum(v)) return toBn(v);
    return '<span class="absent-badge"><i class="bi bi-person-x-fill" aria-hidden="true"></i> অনুপস্থিত</span>';
  }

  function rankBadge(rank) {
    var cls = rank <= 3 ? ' rank-' + rank : '';
    return '<span class="rank-badge' + cls + '">' + ordinal(rank) + '</span>';
  }

function renderTable() {
    var body = document.getElementById('resultBody');
    body.innerHTML = students.map(function (s, i) {
      /* প্রিন্টে প্রতি পেজে ১০ জন — ১১তম, ২১তম... সারিতে পেজ-ব্রেক */
      var rowClass = (i > 0 && i % 10 === 0) ? ' class="page-break"' : '';
      return '<tr' + rowClass + ' data-name="' + escapeHtml(s.name) + '">' +
        '<th scope="row" class="c-name" data-label="নাম">' + escapeHtml(s.name) + '</th>' +
        '<td data-label="প্রধান উস্তাজার ক্লাসে উপস্থিতি/১৩">' + markCell(s.chief) + '</td>' +
        '<td data-label="সহকারী উস্তাজার ক্লাসে উপস্থিতি/১৩">' + markCell(s.assistant) + '</td>' +
        '<td data-label="পড়া আদায় ক্লাসে প্রাপ্ত নম্বর/১৩">' + markCell(s.recitation) + '</td>' +
        '<td data-label="মৌখিক পরীক্ষা/৫৬">' + markCell(s.oral) + '</td>' +
        '<td data-label="আচরণ/৫">' + markCell(s.behavior) + '</td>' +
        '<td class="c-total" data-label="মোট/১০০">' + toBn(s.total) + '</td>' +
        '<td class="c-rank" data-label="প্রাপ্ত স্থান">' + rankBadge(s.rank) + '</td>' +
        '</tr>';
    }).join('');
  }


  function renderPodium() {
    var el = document.getElementById('podium');
    var top = students.filter(function (s) { return s.rank <= 3; });
    el.innerHTML = top.map(function (s) {
      var icon = s.rank === 1 ? 'bi-trophy-fill' : 'bi-award-fill';
      return '<article class="podium-card p-' + s.rank + '">' +
        '<span class="podium-icon"><i class="bi ' + icon + '" aria-hidden="true"></i></span>' +
        '<p class="podium-rank">' + ordinal(s.rank) + ' স্থান</p>' +
        '<h3 class="podium-name">' + escapeHtml(s.name) + '</h3>' +
        '<p class="podium-score"><span>' + toBn(s.total) + '</span> নাম্বার</p>' +
        '<div class="podium-pedestal" aria-hidden="true">' + toBn(s.rank) + '</div>' +
        '</article>';
    }).join('');
  }

  /* ---------- Search ---------- */
  function setupSearch() {
    var input = document.getElementById('searchInput');
    var rows = Array.prototype.slice.call(document.querySelectorAll('#resultBody tr'));
    var empty = document.getElementById('emptyState');

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      rows.forEach(function (row) {
        var match = row.getAttribute('data-name').toLowerCase().indexOf(q) !== -1;
        row.hidden = !match;
        if (match) visible++;
      });
      empty.classList.toggle('d-none', visible !== 0);
      notifyHeight();
    });
  }

  /* ---------- Iframe / অন্য ওয়েবসাইটে এম্বেড করলে উচ্চতা জানানো ---------- */
  function notifyHeight() {
    if (window.parent === window) return;
    var h = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'iim-result-height', height: h }, '*');
  }

  /* ---------- Init ---------- */
  function init() {
    var title = data.examTitle || document.getElementById('examTitle').textContent;
    document.getElementById('examTitle').textContent = title;
    document.title = title + ' | ফলাফল | ইক্বরা ইসলামিক মাদরাসা (IIM)';
    document.getElementById('totalStudents').textContent = toBn(students.length);

    renderPodium();
    renderTable();
    setupSearch();

    document.getElementById('printBtn').addEventListener('click', function () { window.print(); });

    window.addEventListener('load', notifyHeight);
    window.addEventListener('resize', notifyHeight);
    if ('ResizeObserver' in window) new ResizeObserver(notifyHeight).observe(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
