// @ts-check
window.addEventListener("load", () => {
  /**
   * pathを保持
   */
  let currentPath = "";

  /**
   * DOMに変更があった場合に実行される処理
   * PRのマージ先のユーザー名がマージ元と異なる場合にリダイレクト
   */
  const callback = () => {
    const { pathname } = location;
    if (pathname === currentPath) {
      return;
    }
    currentPath = pathname;

    const pattern = new RegExp(
      "^/(?<userTo>.+)/(?<repositoryTo>.+)/compare/(?<branchTo>.+)\\.\\.\\.(?<userFrom>.+):(?<repositoryFrom>.+):(?<branchFrom>.+)$",
    );
    const matches = pattern.exec(pathname);

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

    // リダイレクト
    const redirectTo = `/${userFrom}/${repositoryFrom}/compare/${branchTo}...${userFrom}:${repositoryFrom}:${branchFrom}`;
    location.href = redirectTo;
  };

  /**
   * DOM変更の監視処理
   * SPA対策として、URL変更をDOM変更を通じて検知する
   */
  const observer = new MutationObserver(callback);

  // 初回実行
  callback();

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
});
