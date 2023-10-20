window.addEventListener("load", () => {
  /**
   * @type {string}
   * pathを保持
   */
  let currentPath = location.pathname;

  /**
   * DOMに変更があった場合に実行される処理
   * PRのマージ先のユーザー名がマージ元と異なる場合にリダイレクト
   */
  const callback = () => {
    const path = location.pathname;
    if (path === currentPath) {
      return;
    }
    currentPath = path;

    // 正規表現マッチ
    const pattern =
      /\/(?<userTo>.+)\/(?<repositoryTo>.+)\/compare\/(?<branchTo>.+)\.\.\.(?<userFrom>.+):(?<repositoryFrom>.+):(?<branchFrom>.+)/;
    const matches = pattern.exec(path);

    // PR作成画面以外では実行しない
    if (!matches) {
      return;
    }

    // マージ先が同じユーザー名なら実行しない
    if (matches.groups.userTo === matches.groups.userFrom) {
      return;
    }

    // 一応確認ポップアップを出す
    if (
      !window.confirm(
        "PR先がFork元になっているようです。自身のリポジトリに変更しますか？"
      )
    ) {
      return;
    }

    // 遷移先
    const redirect_to = `/${matches.groups.userFrom}/${matches.groups.repositoryFrom}/compare/${matches.groups.branchTo}...${matches.groups.userFrom}:${matches.groups.repositoryFrom}:${matches.groups.branchFrom}`;

    // リダイレクト
    location.href = redirect_to;
  };

  /**
   * DOM変更の監視処理
   * SPA対策として、URL変更をDOM変更を通じて検知する
   * @type {MutationObserver}
   */
  const observer = new MutationObserver(callback);

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
});
