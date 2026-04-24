import { useEffect } from "react";

function LegacyScheduleShell() {
  return (
    <>
      <div className="week-navigation">
        <div className="auth-group">
          <button id="plusOpen" className="auth-plus">
            Plusプラン
          </button>
          <button id="authOpen" className="auth-open">
            ログイン
          </button>
          <button id="authAccount" className="auth-logout" disabled>
            アカウント設定
          </button>
        </div>
        <div className="week-nav-controls">
          <div className="history-actions" aria-label="履歴操作">
            <button
              id="undoBackup"
              className="history-action"
              type="button"
              aria-label="元に戻す"
              title="元に戻す"
            >
              <span className="history-symbol" aria-hidden="true">
                ↺
              </span>
            </button>
            <button
              id="redoBackup"
              className="history-action"
              type="button"
              aria-label="取り消し"
              title="取り消し"
            >
              <span className="history-symbol" aria-hidden="true">
                ↻
              </span>
            </button>
          </div>
          <button id="prevWeek">←</button>
          <button id="weekLabel" className="week-label-btn" type="button">
            2025年10月第4週
          </button>
          <button id="bulkDeleteOpen" className="bulk-delete-open">
            一括削除
          </button>
          <button id="nextWeek">→</button>
        </div>
        <div className="auth-info">
          <div id="authStatus" className="auth-status">
            未ログイン
          </div>
          <div className="legal-links">
            <a href="/privacy.html" target="_blank" rel="noopener">
              プライバシーポリシー
            </a>
            <a href="/terms.html" target="_blank" rel="noopener">
              利用規約
            </a>
          </div>
          <button id="syncRefresh" className="sync-refresh" type="button">
            同期を有効化
          </button>
          <div id="syncMessage" className="sync-message" aria-live="polite" />
        </div>
      </div>
      <div className="week-view" id="weekView" />

      <div className="modal" id="modal">
        <div className="modal-content">
          <h3 id="modalTitle">予定を追加</h3>

          <label>
            タイトル
            <input id="title" placeholder="例：アルバイト" />
          </label>

          <label>
            種類
            <select
              id="type"
              className="type-select-hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="type-picker">
              <button
                id="typePickerBtn"
                type="button"
                className="type-picker-btn"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <span className="type-picker-swatch" aria-hidden="true" />
                <span className="type-picker-label">種類を選択</span>
                <span className="type-picker-arrow" aria-hidden="true">
                  ▾
                </span>
              </button>
              <div
                id="typePickerPanel"
                className="type-picker-panel"
                role="listbox"
                aria-hidden="true"
                tabIndex={-1}
              >
                <div id="typePickerList" className="type-picker-list" />
              </div>
            </div>
          </label>
          <button id="typeAddOpen" type="button" className="type-add-open">
            種類を追加
          </button>
          <div id="typeAddPanel" className="type-add-panel">
            <div className="type-add-row">
              <input id="typeNew" type="text" placeholder="例：ゼミ、塾 など" />
              <input
                id="typeColor"
                type="color"
                defaultValue="#5b8def"
                aria-label="種類の色"
              />
              <span
                id="typeColorPreview"
                className="color-preview"
                aria-label="選択中の色"
              />
              <button id="typeAdd" type="button">
                追加
              </button>
            </div>
            <div
              className="type-color-palette"
              aria-label="色のプリセット"
              style={{ display: "flex", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" }}
            >
              <div
                className="type-color-grid"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 8px",
                  alignItems: "center",
                  width: "262px"
                }}
              >
                <button type="button" className="color-swatch" data-color="#333333" style={{ background: "#333333" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#123060" style={{ background: "#123060" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#8b5cf6" style={{ background: "#8b5cf6" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#5b8def" style={{ background: "#5b8def" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#0ea5e9" style={{ background: "#0ea5e9" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#7cc7ff" style={{ background: "#7cc7ff" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#10b981" style={{ background: "#10b981" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#f6c344" style={{ background: "#f6c344" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#ff8c00" style={{ background: "#ff8c00" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#ef4444" style={{ background: "#ef4444" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#d97706" style={{ background: "#d97706" }} aria-label="色を選択" />
                <button type="button" className="color-swatch" data-color="#8b5e3b" style={{ background: "#8b5e3b" }} aria-label="色を選択" />
                <button id="typeColorFreeBtn" type="button" className="color-free" aria-label="自由に色を選ぶ">
                  <img src="image/color-wheel.png" alt="" className="color-wheel-icon" />
                </button>
              </div>
            </div>
            <label className="tap-toggle-row">
              <span>完了／未完了を切り替え</span>
              <span className="toggle-switch">
                <input id="tapToggle" type="checkbox" />
                <span className="toggle-slider" aria-hidden="true" />
              </span>
            </label>
            <button id="typeAddClose" type="button" className="type-add-close">
              閉じる
            </button>
          </div>

          <label>
            開始時間
            <input id="start" type="time" defaultValue="09:00" />
          </label>

          <label>
            終了時間
            <input id="end" type="time" defaultValue="10:00" />
          </label>

          <label>
            繰り返し
            <select id="repeat" defaultValue="none">
              <option value="none">繰り返しなし</option>
              <option value="daily">毎日</option>
              <option value="weekly">毎週</option>
              <option value="weekday">平日のみ</option>
            </select>
          </label>
          <div className="delete-scope-row" id="deleteScopeRow">
            <label>
              削除対象
              <select id="deleteScope" defaultValue="single">
                <option value="single">この1件だけ削除</option>
                <option value="future">これ以降の繰り返しを削除</option>
                <option value="all">この予定をすべて削除</option>
              </select>
            </label>
          </div>

          <div className="buttons">
            <button id="save">保存</button>
            <button id="delete">削除</button>
            <button id="cancel">キャンセル</button>
          </div>
        </div>
      </div>

      <div className="modal" id="bulkModal">
        <div className="modal-content bulk-content">
          <h3>予定をまとめて削除</h3>
          <p className="bulk-note">削除したい予定にチェックを付けてください</p>
          <div className="delete-scope-row bulk-scope-row">
            <label>
              削除対象
              <select id="bulkDeleteScope" defaultValue="single">
                <option value="single">この1件だけ削除</option>
                <option value="future">これ以降の繰り返しを削除</option>
                <option value="all">この予定をすべて削除</option>
              </select>
            </label>
          </div>
          <ul id="bulkList" className="bulk-list" />
          <div className="buttons bulk-buttons">
            <button id="bulkDelete">選択を削除</button>
            <button id="bulkCancel">閉じる</button>
          </div>
        </div>
      </div>

      <div className="todo-panel" id="todoPanel" aria-hidden="true">
        <div className="todo-inner">
          <div className="todo-header">
            <h3 id="todoDateLabel">ToDo</h3>
            <button id="todoClose" className="todo-close" aria-label="閉じる">
              ×
            </button>
          </div>

          <div className="todo-input-row">
            <input id="todoInput" type="text" placeholder="やることを入力" />
            <button id="todoAdd">追加</button>
          </div>

          <div className="todo-scroll">
            <ul id="todoList" className="todo-list" />

            <div className="todo-memo">
              <label htmlFor="todoMemo">メモ</label>
              <div id="todoMemoText" className="todo-memo-text" />
              <textarea id="todoMemo" placeholder="この日のメモを書いてください" />
              <div className="todo-memo-buttons">
                <button id="todoMemoEdit" className="muted">
                  メモを編集
                </button>
                <button id="todoMemoSave" className="muted">
                  メモを保存
                </button>
              </div>
            </div>
          </div>

          <div className="todo-footer">
            <button id="todoClearDone" className="muted">
              完了を一括削除
            </button>
          </div>
        </div>
      </div>

      <div className="modal" id="authModal">
        <div className="modal-content auth-modal">
          <h3>ログイン</h3>
          <p className="auth-note">Plusユーザーのみログイン可能です。</p>
          <label htmlFor="authEmail">メールアドレス</label>
          <input id="authEmail" type="email" placeholder="メールアドレスを入力してください" />
          <label htmlFor="authPassword">パスワード</label>
          <input id="authPassword" type="password" placeholder="パスワードを入力してください" />
          <div id="authError" className="auth-error" aria-live="polite" />
          <div className="buttons auth-buttons">
            <button id="authLogin">ログイン</button>
            <button id="authCancel" className="muted">
              閉じる
            </button>
          </div>
          <button id="upgradeBtn" className="upgrade-link">
            Plusプランはこちら
          </button>
        </div>
      </div>

      <div className="modal" id="datePickerModal">
        <div className="date-picker-solo">
          <div className="date-picker-title">日付を選択</div>
          <div className="date-picker-row">
            <label className="date-picker-label" htmlFor="datePickerYear">
              年
            </label>
            <select id="datePickerYear" aria-label="年" />
            <label className="date-picker-label" htmlFor="datePickerMonth">
              月
            </label>
            <select id="datePickerMonth" aria-label="月" />
            <label className="date-picker-label" htmlFor="datePickerDay">
              日
            </label>
            <select id="datePickerDay" aria-label="日" />
            <button id="datePickerCalendarToggle" type="button" aria-label="カレンダーを開く">
              📅
            </button>
          </div>
          <div id="datePickerCalendar" className="date-picker-calendar" aria-hidden="true" />
          <div className="date-picker-actions">
            <button id="datePickerSearch" type="button">
              検索
            </button>
          </div>
        </div>
      </div>

      <div className="modal" id="accountModal">
        <div className="modal-content auth-modal account-modal">
          <h3>アカウント設定</h3>

          <div className="account-section">
            <button id="accountEmailToggle" className="account-toggle" type="button" aria-expanded="false">
              メールアドレスを変更
            </button>
            <div id="accountEmailFields" className="account-fields" aria-hidden="true">
              <label htmlFor="accountEmail">新しいメールアドレス</label>
              <input id="accountEmail" type="email" placeholder="example@sample.com" />
              <div id="accountEmailError" className="auth-error" aria-live="polite" />
              <div className="account-actions">
                <button id="accountEmailUpdate" type="button">
                  変更を保存
                </button>
                <button id="accountEmailClose" className="muted account-close" type="button">
                  閉じる
                </button>
              </div>
            </div>
          </div>
          <div className="account-section">
            <button id="accountPasswordToggle" className="account-toggle" type="button" aria-expanded="false">
              パスワードを変更
            </button>
            <div id="accountPasswordFields" className="account-fields" aria-hidden="true">
              <label htmlFor="accountCurrentPassword">現在のパスワード</label>
              <input id="accountCurrentPassword" type="password" placeholder="現在のパスワード" />
              <label htmlFor="accountNewPassword">新しいパスワード</label>
              <input id="accountNewPassword" type="password" placeholder="新しいパスワード" />
              <label htmlFor="accountNewPasswordConfirm">新しいパスワード（確認）</label>
              <input id="accountNewPasswordConfirm" type="password" placeholder="新しいパスワード（確認）" />
              <div id="accountPasswordError" className="auth-error" aria-live="polite" />
              <div className="account-actions">
                <button id="accountPasswordUpdate" type="button">
                  変更を保存
                </button>
                <button id="accountPasswordClose" className="muted account-close" type="button">
                  閉じる
                </button>
              </div>
            </div>
          </div>
          <div id="accountError" className="auth-error" aria-live="polite" />
          <div className="buttons auth-buttons">
            <button id="accountLogout" className="account-toggle">
              ログアウト
            </button>
            <button id="accountCancel" className="account-toggle">
              plusプランを停止
            </button>
          </div>
        </div>
      </div>

      <div className="modal" id="plusModal">
        <div className="modal-content auth-modal plus-modal-content">
          <h3>Plusプラン</h3>
          <p className="plus-description">複数端末でもデータが自動で保持・同期されます。</p>
          <div className="plus-illustrations">
            <figure className="plus-illust">
              <img id="plusPcImage" src="image/usingcomputer_man_mono.png" alt="PCで計画するイメージ" />
              <figcaption>PCで計画</figcaption>
            </figure>
            <figure className="plus-illust">
              <img
                id="plusMobileImage"
                className="plus-illust-right"
                src="image/smartphone_woman_02_mono.png"
                alt="スマホでToDoを消化するイメージ"
              />
              <figcaption>スマホでToDo消化</figcaption>
            </figure>
          </div>
          <div id="plusError" className="auth-error" aria-live="polite" />
          <div className="buttons auth-buttons">
            <button id="plusChange">Plusプランに変更</button>
            <button id="plusClose" className="muted">
              閉じる
            </button>
          </div>
          <button id="plusLoginOpen" className="upgrade-link">
            すでにアカウントをお持ちの方はこちら
          </button>
        </div>
      </div>

      <div className="modal" id="signupModal">
        <div className="modal-content auth-modal">
          <h3>新規登録</h3>
          <p className="auth-note">Plusプランをご利用いただくための新規登録です。</p>
          <label htmlFor="signupEmail">メールアドレス</label>
          <input id="signupEmail" type="email" placeholder="メールアドレスを入力してください" />
          <label htmlFor="signupPassword">パスワード</label>
          <input id="signupPassword" type="password" placeholder="8文字以上のパスワード" />
          <label htmlFor="signupPasswordConfirm">パスワード確認</label>
          <input id="signupPasswordConfirm" type="password" placeholder="もう一度入力してください" />
          <label className="terms-row">
            <input id="signupTerms" type="checkbox" />
            <span>
              <a href="/terms.html" target="_blank" rel="noopener">
                利用規約
              </a>
              に同意します
            </span>
          </label>
          <div id="signupError" className="auth-error" aria-live="polite" />
          <div className="buttons auth-buttons">
            <button id="signupSubmit">登録</button>
            <button id="signupCancel" className="muted">
              閉じる
            </button>
          </div>
        </div>
      </div>

      <div className="modal" id="paymentModal">
        <div className="modal-content auth-modal">
          <h3>Plusプラン</h3>
          <p className="auth-note">月額240円</p>
          <div id="paymentError" className="auth-error" aria-live="polite" />
          <div className="buttons auth-buttons">
            <button id="paymentSubmit">支払いに進む</button>
            <button id="paymentBack" className="muted">
              戻る
            </button>
          </div>
          <p className="payment-note">※この画面はモック決済です。本番はStripe等の決済導入が必要です。</p>
        </div>
      </div>
    </>
  );
}

export default function App() {
  useEffect(() => {
    const existingScript = document.getElementById("legacy-schedule-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "legacy-schedule-script";
    script.type = "module";
    script.src = "/script.js?v=20260424-1";
    document.body.appendChild(script);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).catch((err) => {
        console.warn("ServiceWorker registration failed:", err);
      });
    }
  }, []);

  return <LegacyScheduleShell />;
}
