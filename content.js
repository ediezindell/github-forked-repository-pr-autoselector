// @ts-check
window.addEventListener("load", () => {
  /**
   * @type {string}
   * pathを保持
   */
  let currentPath = "";

  /**
   * DOMに変更があった場合に実行される処理
   * PRのマージ先のユーザー名がマージ元と異なる場合にリダイレクト
   */
  const observerCallback = () => {
    const path = location.pathname;
    if (path === currentPath) {
      return;
    }
    currentPath = path;

    // 正規表現マッチ
    const pattern = new RegExp(
      "^/(?<userTo>.+)/(?<repositoryTo>.+)/compare/(?<branchTo>.+)\\.\\.\\.(?<userFrom>.+):(?<repositoryFrom>.+):(?<branchFrom>.+)$",
    );
    const matches = pattern.exec(path);

    // PR作成画面以外では実行しない
    if (!matches?.groups) {
      return;
    }

    const { userTo, branchTo, userFrom, repositoryFrom, branchFrom } =
      matches.groups;

    // マージ先が同じユーザー名なら実行しない
    if (userTo === userFrom) {
      return;
    }

    // 確認ポップアップを出す
    if (
      !window.confirm(
        "PR先がFork元になっているようです。自身のリポジトリに変更しますか？",
      )
    ) {
      // キャンセル時は実行しない
      return;
    }

    // 遷移先
    const redirectTo = `/${userFrom}/${repositoryFrom}/compare/${branchTo}...${userFrom}:${repositoryFrom}:${branchFrom}`;

    // リダイレクト
    location.href = redirectTo;
  };

  /**
   * @type {MutationObserver}
   * DOM変更の監視処理
   * SPA対策として、URL変更をDOM変更を通じて検知する
   */
  const observer = new MutationObserver(observerCallback);

  // 初回実行
  observerCallback();

  // DOM監視
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
});
