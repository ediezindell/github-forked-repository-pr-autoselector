(() => {
  const path = window.location.pathname;
  const pattern = /\/(?<user1>.+)\/(?<repository1>.+)\/compare\/(?<branch1>.+)\.\.\.(?<user2>.+):(?<repository2>.+):(?<branch2>.+)/;

  // 正規表現マッチ
  const matches = pattern.exec(path);

  // PR作成画面以外では実行しない
  if(!matches) {
    console.log('not match');
    return;
  }

  // マージ先が同じユーザー名なら実行しない
  if (matches.groups.user1 === matches.groups.user2) {
    console.log('same user');
    return;
  }

  // 一応確認ポップアップを出す
  if(!window.confirm("PR先がFork元になっているようです。自身のリポジトリに変更しますか？")) {
    console.log('cancel');
    return;
  }

  // 遷移先
  const redirect_to = `/${matches.groups.user2}/${matches.groups.repository1}/compare/${matches.groups.branch1}...${matches.groups.user2}:${matches.groups.repository2}:${matches.groups.branch2}`;

  // リダイレクト
  location.href = redirect_to;
})()
