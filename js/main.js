//===============================================================
// debounce関数
//===============================================================
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

//===============================================================
// メニュー関連
//===============================================================

// 変数でセレクタを管理
const menubar = document.getElementById("menubar");
const menubarHdr = document.getElementById("menubar_hdr");

// menu
window.addEventListener("load", handleResize);
window.addEventListener("resize", debounce(handleResize, 10));

function handleResize() {
  if (window.innerWidth < 900) {
    // ここがブレイクポイント指定箇所です
    // 小さな端末用の処理
    document.body.classList.add("small-screen");
    document.body.classList.remove("large-screen");
    menubar.classList.add("display-none");
    menubar.classList.remove("display-block");
    menubarHdr.classList.remove("display-none", "ham");
    menubarHdr.classList.add("display-block");
  } else {
    // 大きな端末用の処理
    document.body.classList.add("large-screen");
    document.body.classList.remove("small-screen");
    menubar.classList.add("display-block");
    menubar.classList.remove("display-none");
    menubarHdr.classList.remove("display-block");
    menubarHdr.classList.add("display-none");

    // ドロップダウンメニューが開いていれば、それを閉じる
    document
      .querySelectorAll(".ddmenu_parent > ul")
      .forEach((el) => (el.style.display = "none"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ハンバーガーメニューをクリックした際の処理
  menubarHdr.addEventListener("click", () => {
    menubarHdr.classList.toggle("ham");
    if (menubarHdr.classList.contains("ham")) {
      menubar.classList.add("display-block");
    } else {
      menubar.classList.remove("display-block");
    }
  });

  // アンカーリンクの場合にメニューを閉じる処理
  menubar.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
      menubar.classList.remove("display-block");
      menubarHdr.classList.remove("ham");
    });
  });

  // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
  menubar.querySelectorAll('a[href=""]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => e.preventDefault());
  });

  // ドロップダウンメニューの処理
  menubar
    .querySelectorAll("li:has(ul)")
    .forEach((li) => li.classList.add("ddmenu_parent"));
  document
    .querySelectorAll(".ddmenu_parent > a")
    .forEach((a) => a.classList.add("ddmenu"));

  // タッチ開始位置を格納する変数
  let touchStartY = 0;

  // タッチデバイス用
  document.querySelectorAll(".ddmenu").forEach((ddmenu) => {
    ddmenu.addEventListener("touchstart", (e) => {
      // タッチ開始位置を記録
      touchStartY = e.touches[0].clientY;
    });
    ddmenu.addEventListener("touchend", (e) => {
      // タッチ終了時の位置を取得
      const touchEndY = e.changedTouches[0].clientY;

      // タッチ開始位置とタッチ終了位置の差分を計算
      const touchDifference = touchStartY - touchEndY;

      // スクロール動作でない（差分が小さい）場合にのみドロップダウンを制御
      if (Math.abs(touchDifference) < 10) {
        // 10px以下の移動ならタップとみなす
        const nextUl = ddmenu.nextElementSibling;
        if (nextUl.style.display === "block") {
          nextUl.style.display = "none";
        } else {
          nextUl.style.display = "block";
        }
        document.querySelectorAll(".ddmenu").forEach((otherDdmenu) => {
          if (otherDdmenu !== ddmenu) {
            otherDdmenu.nextElementSibling.style.display = "none";
          }
        });
        e.preventDefault(); // ドロップダウンのリンクがフォローされるのを防ぐ
      }
    });
  });

  //PC用
  document.querySelectorAll(".ddmenu_parent").forEach((parent) => {
    parent.addEventListener("mouseenter", () => {
      parent.querySelector("ul").style.display = "block";
    });
    parent.addEventListener("mouseleave", () => {
      parent.querySelector("ul").style.display = "none";
    });
  });

  // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
  document.querySelectorAll(".ddmenu_parent ul a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      document
        .querySelectorAll(".ddmenu_parent > ul")
        .forEach((ul) => (ul.style.display = "none"));
    });
  });
});

//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止。
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  const toggleBodyScroll = () => {
    // 条件をチェック
    if (
      menubarHdr.classList.contains("ham") &&
      !menubarHdr.classList.contains("display-none")
    ) {
      // #menubar_hdr が 'ham' クラスを持ち、かつ 'display-none' クラスを持たない場合、スクロールを禁止
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      // その他の場合、スクロールを再び可能に
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
  };

  // 初期ロード時にチェックを実行
  toggleBodyScroll();

  // クラスが動的に変更されることを想定して、MutationObserverを使用
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(menubarHdr, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

//===============================================================
// スムーススクロール（※バージョン2024-1）※ヘッダーの高さとマージンを取得する場合
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  const headerMargin = parseInt(window.getComputedStyle(header).marginTop);
  const totalHeaderHeight = headerHeight + headerMargin;
  // ページ上部へ戻るボタンのセレクター
  const topButton = document.querySelector(".pagetop");
  // ページトップボタン表示用のクラス名
  const scrollShow = "pagetop-show";

  // スムーススクロールを実行する関数
  // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
  const smoothScroll = (target) => {
    // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
    const scrollTo =
      target === "#"
        ? 0
        : document.querySelector(target).offsetTop - totalHeaderHeight;
    // アニメーションでスムーススクロールを実行
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  };

  // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
  document.querySelectorAll('a[href^="#"], .pagetop').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault(); // デフォルトのアンカー動作をキャンセル
      const id = anchor.getAttribute("href") || "#"; // クリックされた要素のhref属性を取得、なければ'#'
      smoothScroll(id); // スムーススクロールを実行
    });
  });

  // スクロールに応じてページトップボタンの表示/非表示を切り替え
  topButton.style.display = "none"; // 初期状態ではボタンを隠す
  window.addEventListener("scroll", () => {
    if (window.pageYOffset >= 300) {
      // スクロール位置が300pxを超えたら
      topButton.style.display = "block";
      topButton.classList.add(scrollShow); // ボタンを表示
    } else {
      topButton.style.display = "none";
      topButton.classList.remove(scrollShow); // それ以外では非表示
    }
  });

  // ページロード時にURLのハッシュが存在する場合の処理
  if (window.location.hash) {
    // ページの最上部に即時スクロールする
    window.scrollTo(0, 0);
    // 少し遅延させてからスムーススクロールを実行
    setTimeout(() => {
      smoothScroll(window.location.hash);
    }, 10);
  }
});

//===============================================================
// 汎用開閉処理
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".openclose-parts").forEach((part) => {
    const nextElement = part.nextElementSibling;
    nextElement.style.display = "none";
    part.addEventListener("click", () => {
      if (nextElement.style.display === "none") {
        nextElement.style.display = "block";
      } else {
        nextElement.style.display = "none";
      }
      document.querySelectorAll(".openclose-parts").forEach((otherPart) => {
        if (otherPart !== part) {
          otherPart.nextElementSibling.style.display = "none";
        }
      });
    });
  });
});

//===============================================================
// テキストのフェードイン効果
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  const fadeInTexts = document.querySelectorAll(".fade-in-text");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const text = entry.target.textContent;
        entry.target.textContent = "";
        entry.target.style.visibility = "visible";

        [...text].forEach((char, i) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.animationDelay = `${i * 0.2}s`;
          span.classList.add("char");
          entry.target.appendChild(span);
        });

        entry.target.dataset.animated = "true";
      }
    });
  });

  fadeInTexts.forEach((text) => observer.observe(text));
});

//===============================================================
// 詳細ページのサムネイル切り替え
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  // 初期表示: 各 .thumbnail-view に対して、直後の .thumbnail の最初の画像を表示
  document.querySelectorAll(".thumbnail-view-parts").forEach((view) => {
    const firstThumbnailSrc = view.nextElementSibling.querySelector("img").src;
    const defaultImage = document.createElement("img");
    defaultImage.src = firstThumbnailSrc;
    view.appendChild(defaultImage);
  });

  // サムネイルがクリックされたときの動作
  document.querySelectorAll(".thumbnail-parts img").forEach((img) => {
    img.addEventListener("click", function () {
      const imgSrc = this.src;
      const newImage = document.createElement("img");
      newImage.src = imgSrc;
      newImage.style.display = "none";

      // このサムネイルの直前の .thumbnail-view 要素を取得
      const targetPhoto =
        this.closest(".thumbnail-parts").previousElementSibling;

      const oldImage = targetPhoto.querySelector("img");
      oldImage.style.opacity = "0";
      setTimeout(() => {
        targetPhoto.innerHTML = "";
        targetPhoto.appendChild(newImage);
        newImage.style.display = "block";
        setTimeout(() => {
          newImage.style.opacity = "1";
        }, 50);
      }, 400);
    });
  });
});

//===============================================================
// スライドショー
//===============================================================
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll("#mainimg .slide");
  const slideCount = slides.length;
  let currentIndex = 0;

  slides[currentIndex].style.opacity = "1";
  slides[currentIndex].classList.add("active");

  setInterval(() => {
    const nextIndex = (currentIndex + 1) % slideCount;
    slides[currentIndex].style.opacity = "0";
    slides[currentIndex].classList.remove("active");
    slides[nextIndex].style.opacity = "1";
    slides[nextIndex].classList.add("active");
    currentIndex = nextIndex;
  }, 4000); // 4秒ごとにスライドを切り替える
});
