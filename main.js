const { useState, useMemo } = React;

/** 工具函式 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
};

const daysFromToday = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return null;
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

const isOverdueTodo = (todo) => {
  if (!todo.dueDate || todo.status === "已完成") return false;
  const d = parseDate(todo.dueDate);
  if (!d) return false;
  const today = new Date();
  return d.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};

const RELATIONSHIP_LEVEL_LABEL = {
  A: "A 級",
  B: "B 級",
  C: "C 級",
};

const STATUS_OPTIONS = ["未開始", "進行中", "已完成"];
const PRIORITY_OPTIONS = ["高", "中", "低"];

/** 假資料 */
const initialContacts = [
  {
    id: 1,
    name: "王小明",
    companyName: "立新科技股份有限公司",
    title: "資深業務經理",
    department: "企業解決方案部",
    industry: "SaaS / 軟體服務",
    relationshipLevel: "A",
    lastInteractionDate: "2025-11-20",
    nextFollowUpDate: "2025-11-28",
    tags: ["AI 潛在", "物流", "協會：TAIA"],
    email: "leo.wang@example.com",
    mobile: "0912-345-678",
    phone: "02-1234-5678",
    cardSystemId: "CARD-0001",
    relationshipBackground: {
      sourceType: "協會活動",
      sourceDetail: "TAIA 2025 春季論壇",
      firstMetDate: "2025-03-15",
      introducerName: "陳志強",
      communities: ["TAIA", "AI 讀書會"],
      firstMeetingNotes:
        "初次於 TAIA 論壇茶敘區認識，對方對 AI OCR 與 RAG 應用有高度興趣，強調導入時需注意資訊安全與權限控管。",
    },
    interactions: [
      {
        id: 101,
        interactionDate: "2025-11-20",
        interactionType: "面談",
        subject: "AI OCR 導入可行性討論",
        summary:
          "說明目前文件量體與痛點，確認導入目標為提升作業效率與降低 Key in 錯誤率。",
        relatedTodo: "12/01 前寄出方案簡報與估價單",
        owner: "目前使用者",
        hasLinkedTodo: true,
      },
      {
        id: 102,
        interactionDate: "2025-10-05",
        interactionType: "線上會議",
        subject: "需求初步盤點",
        summary:
          "釐清部門使用情境，對方傾向先從單一據點 POC，再逐步擴大。",
        relatedTodo: "",
        owner: "目前使用者",
        hasLinkedTodo: false,
      },
    ],
    todos: [
      {
        id: 201,
        todoTitle: "寄出 AI OCR 方案簡報與估價單",
        dueDate: "2025-12-01",
        status: "進行中",
        priority: "高",
        createdAt: "2025-11-20",
      },
      {
        id: 202,
        todoTitle: "與內部 RD 評估現有 API 串接方式",
        dueDate: "2025-11-25",
        status: "未開始",
        priority: "中",
        createdAt: "2025-11-18",
      },
    ],
  },
  {
    id: 2,
    name: "林怡君",
    companyName: "宏泰物流股份有限公司",
    title: "資訊處經理",
    department: "資訊處",
    industry: "物流 / 倉儲",
    relationshipLevel: "B",
    lastInteractionDate: "2025-10-10",
    nextFollowUpDate: "2025-12-10",
    tags: ["物流", "WMS", "AI 預測"],
    email: "ivy.lin@example.com",
    mobile: "0922-888-777",
    phone: "02-8765-4321",
    cardSystemId: "CARD-0002",
    relationshipBackground: {
      sourceType: "客戶介紹",
      sourceDetail: "由現有客戶：佳聯物流 引薦",
      firstMetDate: "2025-04-22",
      introducerName: "佳聯物流／張協理",
      communities: ["TCL 物流聯誼會"],
      firstMeetingNotes:
        "主要關注車隊調度與倉儲人力排班最佳化，希望透過 AI 協助預測貨量高峰。",
    },
    interactions: [
      {
        id: 103,
        interactionDate: "2025-10-10",
        interactionType: "電話",
        subject: "確認年底預算編列情況",
        summary: "尚在評估階段，需要內部先做 ROI 試算。",
        relatedTodo: "提供簡易 ROI 試算模板",
        owner: "目前使用者",
        hasLinkedTodo: true,
      },
    ],
    todos: [
      {
        id: 203,
        todoTitle: "整理 AI 預測專案案例給客戶參考",
        dueDate: "2025-11-15",
        status: "已完成",
        priority: "中",
        createdAt: "2025-10-10",
      },
    ],
  },
  {
    id: 3,
    name: "張志豪",
    companyName: "新創電商有限公司",
    title: "共同創辦人",
    department: "營運",
    industry: "電子商務",
    relationshipLevel: "C",
    lastInteractionDate: "2025-07-01",
    nextFollowUpDate: "",
    tags: ["電商", "MarTech"],
    email: "jeff.chang@example.com",
    mobile: "0933-111-222",
    phone: "",
    cardSystemId: "CARD-0003",
    relationshipBackground: {
      sourceType: "線上會議",
      sourceDetail: "朋友介紹後安排的線上簡報",
      firstMetDate: "2025-06-20",
      introducerName: "朋友／黃小美",
      communities: [],
      firstMeetingNotes:
        "公司規模仍小，暫時以觀望為主，但對未來成長階段導入 AI CRM 願意持續討論。",
    },
    interactions: [],
    todos: [
      {
        id: 204,
        todoTitle: "明年 Q1 再次關心近況",
        dueDate: "2026-01-15",
        status: "未開始",
        priority: "低",
        createdAt: "2025-07-01",
      },
    ],
  },
];

/** 導覽列 */
const Sidebar = ({ activeView, onChangeView, contacts }) => {
  const totalTodos = useMemo(
    () => contacts.reduce((sum, c) => sum + (c.todos?.length || 0), 0),
    [contacts]
  );
  const pendingTodos = useMemo(
    () =>
      contacts.reduce(
        (sum, c) =>
          sum +
          (c.todos?.filter((t) => t.status !== "已完成").length || 0),
        0
      ),
    [contacts]
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-title">業務用客戶關係管理系統（MVP）</div>
      <ul className="nav-list">
        <li className="nav-item">
          <button
            className={
              "nav-button" + (activeView === "contacts" ? " active" : "")
            }
            onClick={() => onChangeView("contacts")}
          >
            <span>聯絡人列表</span>
            <span className="badge">{contacts.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={
              "nav-button" + (activeView === "todos" ? " active" : "")
            }
            onClick={() => onChangeView("todos")}
          >
            <span>待辦與提醒總覽</span>
            <span className="badge">
              {pendingTodos}/{totalTodos}
            </span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

/** 聯絡人列表頁 A */
const ContactsList = ({
  contacts,
  onSelectContact,
  onCreateContactClick,
}) => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [interactionFilter, setInteractionFilter] = useState("ALL");

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const keyword = search.trim().toLowerCase();
      if (keyword) {
        const fullText = (
          c.name +
          c.companyName +
          (c.title || "") +
          (c.industry || "") +
          (c.tags || []).join(",")
        )
          .toLowerCase()
          .replace(/\s/g, "");
        if (!fullText.includes(keyword.replace(/\s/g, ""))) return false;
      }

      if (levelFilter !== "ALL" && c.relationshipLevel !== levelFilter) {
        return false;
      }

      if (interactionFilter !== "ALL") {
        const days = daysFromToday(c.lastInteractionDate);
        if (interactionFilter === "LAST_30" && (days == null || days > 30)) {
          return false;
        }
        if (interactionFilter === "OVER_60" && (days == null || days <= 60)) {
          return false;
        }
      }

      return true;
    });
  }, [contacts, search, levelFilter, interactionFilter]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">聯絡人列表</div>
            <div className="card-subtitle">
              快速搜尋 / 篩選聯絡人，查看基本資訊、最近互動與下一次聯絡時間。
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onCreateContactClick}>
            ＋ 新增手動聯絡人（示意）
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>搜尋（姓名 / 公司 / 關鍵字）</label>
            <input
              className="input"
              placeholder="輸入關鍵字..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>關係等級篩選</label>
            <select
              className="select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="ALL">全部</option>
              <option value="A">A 級</option>
              <option value="B">B 級</option>
              <option value="C">C 級</option>
            </select>
          </div>
          <div className="form-group">
            <label>互動狀態篩選</label>
            <select
              className="select"
              value={interactionFilter}
              onChange={(e) => setInteractionFilter(e.target.value)}
            >
              <option value="ALL">全部</option>
              <option value="LAST_30">最近 30 天有互動</option>
              <option value="OVER_60">超過 60 天未互動</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>公司名稱</th>
              <th>職稱</th>
              <th>行業別</th>
              <th>關係等級</th>
              <th>最近互動日期</th>
              <th>下一次聯絡日期</th>
              <th>標籤</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => (
              <tr
                key={c.id}
                className="table-row-clickable"
                onClick={() => onSelectContact(c.id)}
              >
                <td>{c.name}</td>
                <td>{c.companyName}</td>
                <td>{c.title}</td>
                <td>{c.industry}</td>
                <td>
                  <span
                    className={
                      "badge-level " +
                      (c.relationshipLevel === "A"
                        ? "badge-level-a"
                        : c.relationshipLevel === "B"
                        ? "badge-level-b"
                        : "badge-level-c")
                    }
                  >
                    {RELATIONSHIP_LEVEL_LABEL[c.relationshipLevel] ||
                      c.relationshipLevel}
                  </span>
                </td>
                <td>{c.lastInteractionDate || "-"}</td>
                <td>{c.nextFollowUpDate || "-"}</td>
                <td>
                  {(c.tags || []).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={8}>目前沒有符合條件的聯絡人。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Tab1：關係背景 */
const RelationshipBackgroundTab = ({ contact, onSave }) => {
  const [form, setForm] = useState(() => ({
    sourceType: contact.relationshipBackground?.sourceType || "",
    sourceDetail: contact.relationshipBackground?.sourceDetail || "",
    firstMetDate: contact.relationshipBackground?.firstMetDate || "",
    introducerName: contact.relationshipBackground?.introducerName || "",
    communitiesText: (contact.relationshipBackground?.communities || []).join(
      ", "
    ),
    firstMeetingNotes: contact.relationshipBackground?.firstMeetingNotes || "",
  }));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const communities = form.communitiesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({
      ...contact,
      relationshipBackground: {
        sourceType: form.sourceType,
        sourceDetail: form.sourceDetail,
        firstMetDate: form.firstMetDate,
        introducerName: form.introducerName,
        communities,
        firstMeetingNotes: form.firstMeetingNotes,
      },
    });
  };

  return (
    <div className="tab-panel">
      <div className="form-row">
        <div className="form-group">
          <label>認識管道</label>
          <select
            className="select"
            value={form.sourceType}
            onChange={(e) => handleChange("sourceType", e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="展覽">展覽</option>
            <option value="協會活動">協會活動</option>
            <option value="客戶介紹">客戶介紹</option>
            <option value="線上會議">線上會議</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div className="form-group">
          <label>認識地點或活動名稱</label>
          <input
            className="input"
            value={form.sourceDetail}
            onChange={(e) => handleChange("sourceDetail", e.target.value)}
            placeholder="例如：2025 台北資訊月、某某協會例會"
          />
        </div>
        <div className="form-group">
          <label>初次認識日期</label>
          <input
            type="date"
            className="input"
            value={form.firstMetDate}
            onChange={(e) => handleChange("firstMetDate", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>介紹人</label>
          <input
            className="input"
            value={form.introducerName}
            onChange={(e) => handleChange("introducerName", e.target.value)}
            placeholder="例如：某某客戶／某某協會理事"
          />
        </div>
        <div className="form-group">
          <label>所屬協會 / 社群（以逗號分隔）</label>
          <input
            className="input"
            value={form.communitiesText}
            onChange={(e) => handleChange("communitiesText", e.target.value)}
            placeholder="例如：TAIA, 某某讀書會"
          />
        </div>
      </div>

      <div className="form-group">
        <label>第一次見面重點摘要</label>
        <textarea
          className="textarea"
          value={form.firstMeetingNotes}
          onChange={(e) => handleChange("firstMeetingNotes", e.target.value)}
          placeholder="記錄第一次見面的關鍵內容、對方關注議題、對公司的初步印象..."
        />
      </div>

      <div style={{ marginTop: 8, textAlign: "right" }}>
        <button className="btn btn-secondary btn-sm" onClick={handleSave}>
          儲存關係背景（前端示意）
        </button>
      </div>
    </div>
  );
};

/** Tab2：互動紀錄 */
const InteractionsTab = ({ contact, onSave }) => {
  const [form, setForm] = useState({
    interactionDate: "",
    interactionType: "面談",
    subject: "",
    summary: "",
    relatedTodo: "",
    createLinkedTodo: true,
  });

  const sortedInteractions = useMemo(() => {
    return [...(contact.interactions || [])].sort((a, b) => {
      const da = parseDate(a.interactionDate) || 0;
      const db = parseDate(b.interactionDate) || 0;
      return db - da;
    });
  }, [contact.interactions]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.interactionDate || !form.subject) return;
    const newId =
      (contact.interactions?.reduce((max, i) => Math.max(max, i.id), 0) ||
        100) + 1;
    const newInteraction = {
      id: newId,
      interactionDate: form.interactionDate,
      interactionType: form.interactionType,
      subject: form.subject,
      summary: form.summary,
      relatedTodo: form.relatedTodo,
      owner: "目前使用者",
      hasLinkedTodo: !!form.relatedTodo && form.createLinkedTodo,
    };

    const updatedContact = {
      ...contact,
      interactions: [...(contact.interactions || []), newInteraction],
    };

    onSave(updatedContact);

    setForm({
      interactionDate: "",
      interactionType: "面談",
      subject: "",
      summary: "",
      relatedTodo: "",
      createLinkedTodo: true,
    });
  };

  return (
    <div className="tab-panel">
      <div className="card" style={{ padding: "12px 14px" }}>
        <div className="card-header">
          <div className="card-title">新增互動紀錄</div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>日期</label>
            <input
              type="date"
              className="input"
              value={form.interactionDate}
              onChange={(e) =>
                handleChange("interactionDate", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label>互動方式</label>
            <select
              className="select"
              value={form.interactionType}
              onChange={(e) =>
                handleChange("interactionType", e.target.value)
              }
            >
              <option value="面談">面談</option>
              <option value="線上會議">線上會議</option>
              <option value="電話">電話</option>
              <option value="Line">Line</option>
              <option value="Email">Email</option>
              <option value="活動場合">活動場合</option>
            </select>
          </div>
          <div className="form-group">
            <label>主題</label>
            <input
              className="input"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="例如：AI OCR 導入討論"
            />
          </div>
        </div>

        <div className="form-group">
          <label>摘要</label>
          <textarea
            className="textarea"
            value={form.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="本次談了什麼、對方關注點..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>待辦事項（選填，將可同步建立待辦）</label>
            <input
              className="input"
              value={form.relatedTodo}
              onChange={(e) => handleChange("relatedTodo", e.target.value)}
              placeholder="例如：寄出簡報、下週約內部技術會議"
            />
          </div>
          <div className="form-group">
            <label>是否同步建立待辦</label>
            <select
              className="select"
              value={form.createLinkedTodo ? "true" : "false"}
              onChange={(e) =>
                handleChange("createLinkedTodo", e.target.value === "true")
              }
            >
              <option value="true">是（示意）</option>
              <option value="false">否</option>
            </select>
            <div className="text-muted">
              此雛形僅在互動紀錄中標示「已建立待辦」，實際待辦同步可於後端實作。
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            ＋ 新增互動紀錄
          </button>
        </div>
      </div>

      <div>
        <div className="card-header" style={{ padding: 0, marginBottom: 6 }}>
          <div className="card-title">互動紀錄時間軸</div>
        </div>
        {sortedInteractions.length === 0 && (
          <div className="text-muted">目前尚未建立任何互動紀錄。</div>
        )}
        {sortedInteractions.map((i) => (
          <div key={i.id} className="timeline-item">
            <div className="timeline-header">
              <span>
                {i.interactionDate}・{i.interactionType}
              </span>
              <span className="text-muted">記錄人：{i.owner}</span>
            </div>
            <div className="timeline-title">{i.subject}</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>{i.summary}</div>
            {i.relatedTodo && (
              <div style={{ fontSize: 12 }}>
                待辦事項：{i.relatedTodo}{" "}
                {i.hasLinkedTodo && (
                  <span className="tag">已建立待辦（示意）</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Tab3：單一聯絡人的待辦 */
const ContactTodosTab = ({ contact, onSave }) => {
  const [form, setForm] = useState({
    todoTitle: "",
    dueDate: "",
    priority: "中",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.todoTitle || !form.dueDate) return;
    const newId =
      (contact.todos?.reduce((max, t) => Math.max(max, t.id), 0) || 200) + 1;
    const today = new Date();
    const createdAt = today.toISOString().slice(0, 10);

    const newTodo = {
      id: newId,
      todoTitle: form.todoTitle,
      dueDate: form.dueDate,
      priority: form.priority,
      status: "未開始",
      createdAt,
    };

    const updatedContact = {
      ...contact,
      todos: [...(contact.todos || []), newTodo],
    };

    onSave(updatedContact);
    setForm({ todoTitle: "", dueDate: "", priority: "中" });
  };

  const handleStatusChange = (todoId, newStatus) => {
    const updatedContact = {
      ...contact,
      todos: (contact.todos || []).map((t) =>
        t.id === todoId ? { ...t, status: newStatus } : t
      ),
    };
    onSave(updatedContact);
  };

  return (
    <div className="tab-panel">
      <div className="card" style={{ padding: "12px 14px" }}>
        <div className="card-header">
          <div className="card-title">新增待辦事項</div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>描述</label>
            <input
              className="input"
              value={form.todoTitle}
              onChange={(e) => handleChange("todoTitle", e.target.value)}
              placeholder="例如：寄出方案簡報、與內部 RD 討論可行性"
            />
          </div>
          <div className="form-group">
            <label>到期日</label>
            <input
              type="date"
              className="input"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>優先順序</label>
            <select
              className="select"
              value={form.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            ＋ 新增待辦
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>描述</th>
              <th>到期日</th>
              <th>狀態</th>
              <th>優先順序</th>
              <th>建立日期</th>
            </tr>
          </thead>
          <tbody>
            {(contact.todos || []).map((t) => (
              <tr
                key={t.id}
                className={"todo-row" + (isOverdueTodo(t) ? " overdue" : "")}
              >
                <td className="todo-title">{t.todoTitle}</td>
                <td>{t.dueDate}</td>
                <td>
                  <select
                    className="todo-status-select"
                    value={t.status}
                    onChange={(e) =>
                      handleStatusChange(t.id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{t.priority}</td>
                <td>{t.createdAt}</td>
              </tr>
            ))}
            {(contact.todos || []).length === 0 && (
              <tr>
                <td colSpan={5}>目前尚未建立任何待辦事項。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** 聯絡人詳情頁 B */
const ContactDetail = ({ contact, onUpdateContact, onBackToList }) => {
  const [activeTab, setActiveTab] = useState("background");

  const handleSaveContact = (updatedContact) => {
    onUpdateContact(updatedContact);
  };

  return (
    <div>
      <div className="breadcrumb">
        <a onClick={onBackToList}>聯絡人列表</a> &nbsp;/&nbsp; 聯絡人詳情
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              {contact.name}（{contact.companyName}）
            </div>
            <div className="card-subtitle">
              {contact.department}・{contact.title}・{contact.industry}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>
              <span
                className={
                  "badge-level " +
                  (contact.relationshipLevel === "A"
                    ? "badge-level-a"
                    : contact.relationshipLevel === "B"
                    ? "badge-level-b"
                    : "badge-level-c")
                }
              >
                關係等級：{RELATIONSHIP_LEVEL_LABEL[contact.relationshipLevel]}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
              名片系統 ID：{contact.cardSystemId}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <div>{contact.email || "-"}</div>
          </div>
          <div className="form-group">
            <label>手機</label>
            <div>{contact.mobile || "-"}</div>
          </div>
          <div className="form-group">
            <label>公司電話</label>
            <div>{contact.phone || "-"}</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>最近互動日期</label>
            <div>{contact.lastInteractionDate || "-"}</div>
          </div>
          <div className="form-group">
            <label>下一次聯絡日期</label>
            <div>{contact.nextFollowUpDate || "-"}</div>
          </div>
          <div className="form-group">
            <label>標籤</label>
            <div>
              {(contact.tags || []).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs">
          <div className="tab-list">
            <button
              className={
                "tab-button" +
                (activeTab === "background" ? " active" : "")
              }
              onClick={() => setActiveTab("background")}
            >
              關係背景
            </button>
            <button
              className={
                "tab-button" +
                (activeTab === "interactions" ? " active" : "")
              }
              onClick={() => setActiveTab("interactions")}
            >
              互動紀錄
            </button>
            <button
              className={
                "tab-button" + (activeTab === "todos" ? " active" : "")
              }
              onClick={() => setActiveTab("todos")}
            >
              待辦事項
            </button>
          </div>
        </div>

        {activeTab === "background" && (
          <RelationshipBackgroundTab
            contact={contact}
            onSave={handleSaveContact}
          />
        )}
        {activeTab === "interactions" && (
          <InteractionsTab contact={contact} onSave={handleSaveContact} />
        )}
        {activeTab === "todos" && (
          <ContactTodosTab contact={contact} onSave={handleSaveContact} />
        )}
      </div>
    </div>
  );
};

/** 待辦與提醒總覽頁 C */
const GlobalTodoPage = ({
  contacts,
  onNavigateToContact,
  onUpdateTodoStatus,
}) => {
  const [showOnlyPending, setShowOnlyPending] = useState(true);
  const [levelFilter, setLevelFilter] = useState("ALL");

  const allTodos = useMemo(() => {
    const list = [];
    contacts.forEach((c) => {
      (c.todos || []).forEach((t) => {
        list.push({
          ...t,
          contactId: c.id,
          contactName: c.name,
          companyName: c.companyName,
          relationshipLevel: c.relationshipLevel,
        });
      });
    });

    return list.sort((a, b) => {
      const da = parseDate(a.dueDate) || 0;
      const db = parseDate(b.dueDate) || 0;
      return da - db;
    });
  }, [contacts]);

  const filteredTodos = useMemo(() => {
    return allTodos.filter((t) => {
      if (showOnlyPending && t.status === "已完成") return false;
      if (levelFilter !== "ALL" && t.relationshipLevel !== levelFilter)
        return false;
      return true;
    });
  }, [allTodos, showOnlyPending, levelFilter]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">待辦與提醒總覽</div>
            <div className="card-subtitle">
              顯示所有聯絡人的待辦事項，協助業務每日檢查有哪些客戶需要關心。
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>狀態篩選</label>
            <select
              className="select"
              value={showOnlyPending ? "PENDING" : "ALL"}
              onChange={(e) =>
                setShowOnlyPending(e.target.value === "PENDING")
              }
            >
              <option value="PENDING">只看未完成</option>
              <option value="ALL">顯示全部</option>
            </select>
          </div>
          <div className="form-group">
            <label>關係等級篩選</label>
            <select
              className="select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="ALL">全部</option>
              <option value="A">A 級</option>
              <option value="B">B 級</option>
              <option value="C">C 級</option>
            </select>
          </div>
          <div className="form-group">
            <label>排序</label>
            <div className="text-muted">固定依「到期日由近到遠」排序。</div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>聯絡人姓名</th>
              <th>公司名稱</th>
              <th>待辦事項描述</th>
              <th>到期日</th>
              <th>關係等級</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((t) => (
              <tr
                key={`${t.contactId}-${t.id}`}
                className={"todo-row" + (isOverdueTodo(t) ? " overdue" : "")}
              >
                <td>
                  <a
                    style={{ color: "#2563eb", cursor: "pointer" }}
                    onClick={() => onNavigateToContact(t.contactId)}
                  >
                    {t.contactName}
                  </a>
                </td>
                <td>{t.companyName}</td>
                <td className="todo-title">{t.todoTitle}</td>
                <td>{t.dueDate}</td>
                <td>
                  <span
                    className={
                      "badge-level " +
                      (t.relationshipLevel === "A"
                        ? "badge-level-a"
                        : t.relationshipLevel === "B"
                        ? "badge-level-b"
                        : "badge-level-c")
                    }
                  >
                    {RELATIONSHIP_LEVEL_LABEL[t.relationshipLevel]}
                  </span>
                </td>
                <td>
                  <select
                    className="todo-status-select"
                    value={t.status}
                    onChange={(e) =>
                      onUpdateTodoStatus(
                        t.contactId,
                        t.id,
                        e.target.value
                      )
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredTodos.length === 0 && (
              <tr>
                <td colSpan={6}>目前沒有符合條件的待辦事項。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** App 主元件 */
const App = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [view, setView] = useState("contacts"); // 'contacts' | 'contactDetail' | 'todos'
  const [selectedContactId, setSelectedContactId] = useState(
    initialContacts[0]?.id || null
  );

  const currentContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId) || null,
    [contacts, selectedContactId]
  );

  const handleUpdateContact = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
  };

  const handleUpdateTodoStatus = (contactId, todoId, newStatus) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        return {
          ...c,
          todos: (c.todos || []).map((t) =>
            t.id === todoId ? { ...t, status: newStatus } : t
          ),
        };
      })
    );
  };

  const handleSelectContact = (id) => {
    setSelectedContactId(id);
    setView("contactDetail");
  };

  const handleNavigateToContactFromTodo = (id) => {
    setSelectedContactId(id);
    setView("contactDetail");
  };

  const handleCreateContactClick = () => {
    alert("此為雛形示意，實際新增聯絡人流程可於後端實作。");
  };

  return (
    <div>
      <header className="app-header">
        <div>
          <div className="app-header-title">
            業務用客戶關係管理系統（MVP）
          </div>
          <div className="app-header-sub">
            從名片管理系統匯入聯絡人，在此補充關係背景、互動紀錄與待辦提醒。
          </div>
        </div>
        <div className="app-header-sub">
          Demo 僅使用前端假資料，後端與名片系統串接可於下一階段實作。
        </div>
      </header>

      <div className="layout">
        <Sidebar
          activeView={view}
          onChangeView={setView}
          contacts={contacts}
        />
        <main className="content">
          {view === "contacts" && (
            <ContactsList
              contacts={contacts}
              onSelectContact={handleSelectContact}
              onCreateContactClick={handleCreateContactClick}
            />
          )}
          {view === "contactDetail" && currentContact && (
            <ContactDetail
              contact={currentContact}
              onUpdateContact={handleUpdateContact}
              onBackToList={() => setView("contacts")}
            />
          )}
          {view === "todos" && (
            <GlobalTodoPage
              contacts={contacts}
              onNavigateToContact={handleNavigateToContactFromTodo}
              onUpdateTodoStatus={handleUpdateTodoStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
};

/** 掛載到 DOM */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
