/**
 * OnlyOffice 文档服务集成模块
 * 提供文档创建、编辑和查看功能
 */

class OfficeManager {
  constructor() {
    console.log("OfficeManager 构造函数被调用");
    this.documentApi = null;
    this.currentDocumentType = null;
    this.isEditorLoaded = false;
    this.isCreating = false; // 添加创建状态标识
    this.isLoading = false; // 添加加载状态标识
    this.init();
  }

  init() {
    console.log("OfficeManager 初始化...");
    this.bindEvents();
  }

  /**
   * 绑定页面事件
   */
  bindEvents() {
    // 确保在 DOM 加载完成后绑定事件
    const bindButtonEvents = () => {
      console.log("正在绑定按钮事件...");
      const buttons = document.querySelectorAll(".action-button");
      console.log("找到按钮数量:", buttons.length);

      buttons.forEach((button, index) => {
        console.log(`绑定第${index + 1}个按钮:`, button.textContent);
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const action = e.target.textContent;
          console.log(`点击了: ${action}`);
          this.handleButtonClick(action);
        });
      });
    };

    // 如果 DOM 已经加载完成，直接绑定
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bindButtonEvents);
    } else {
      // DOM 已经加载完成
      bindButtonEvents();
    }
  }

  /**
   * 处理按钮点击事件
   */
  handleButtonClick(action) {
    console.log("处理按钮点击:", action);
    switch (action) {
      case "上传文档并打开":
        console.log("执行上传文档功能");
        this.showUploadPage();
        break;
      case "新建 Word":
        console.log("执行新建 Word 功能");
        this.createNewDocument("word");
        break;
      case "新建 Excel":
        console.log("执行新建 Excel 功能");
        this.createNewDocument("cell");
        break;
      case "新建 PowerPoint":
        console.log("执行新建 PowerPoint 功能");
        this.createNewDocument("slide");
        break;
      case "新建 PDF":
        console.log("执行新建 PDF 功能");
        this.createNewDocument("pdf");
        break;
      // 新增查看文档功能
      case "查看 Word 示例":
        console.log("执行查看 Word 示例功能");
        this.viewDocument("word");
        break;
      case "查看 Excel 示例":
        console.log("执行查看 Excel 示例功能");
        this.viewDocument("excel");
        break;
      case "查看 PowerPoint 示例":
        console.log("执行查看 PowerPoint 示例功能");
        this.viewDocument("ppt");
        break;
      case "查看 PDF 示例":
        console.log("执行查看 PDF 示例功能");
        this.viewDocument("pdf");
        break;
      default:
        console.log("未知的按钮动作:", action);
    }
  }

  /**
   * 显示上传页面
   */
  showUploadPage() {
    // 检查是否已经在创建或加载中
    if (this.isCreating || this.isLoading) {
      console.log("正在创建或加载中，忽略上传请求");
      return;
    }

    console.log("显示上传页面");
    this.replaceMainContent("上传文档并打开", "选择您要查看和编辑的文档文件");
    // 这里可以添加文件上传逻辑
  }

  /**
   * 快捷查看示例文档方法（供外部调用）
   */
  viewSampleDocument(type) {
    console.log("快捷查看示例文档:", type);
    this.viewDocument(type);
  }

  /**
   * 创建新文档
   */
  createNewDocument(documentType) {
    console.log("请求创建文档类型:", documentType);

    // 检查是否已经在创建或加载中
    if (this.isCreating || this.isLoading) {
      console.log("正在创建或加载中，忽略重复请求");
      return;
    }

    const typeMap = {
      word: {
        title: "Word 文档",
        subtitle: "正在创建新的 Word 文档...",
        type: "word",
      },
      cell: {
        title: "Excel 表格",
        subtitle: "正在创建新的 Excel 表格...",
        type: "cell",
      },
      slide: {
        title: "PowerPoint 演示",
        subtitle: "正在创建新的 PowerPoint 演示文稿...",
        type: "slide",
      },
      pdf: {
        title: "PDF 文档",
        subtitle: "正在创建新的 PDF 文档...",
        type: "pdf",
      },
    };

    const config = typeMap[documentType];
    if (!config) {
      console.error("不支持的文档类型:", documentType);
      return;
    }

    // 设置创建状态
    this.isCreating = true;
    this.currentDocumentType = config.type;

    console.log("开始创建文档:", config.title);

    // 显示 loading 蒙层
    this.showLoadingOverlay(config.title, config.subtitle);

    // 延迟加载编辑器，模拟创建过程
    setTimeout(() => {
      // 隐藏 loading 蒙层
      this.hideLoadingOverlay();

      // 替换主内容
      this.replaceMainContent(config.title, "文档编辑器已加载完成");

      // 为新建文档提供默认的空白文档模板
      const defaultUrls = {
        word: "https://moqisoft.github.io/assets/blank.docx",
        cell: "https://moqisoft.github.io/assets/blank.xlsx",
        slide: "https://moqisoft.github.io/assets/blank.pptx",
        pdf: "https://moqisoft.github.io/assets/blank.pdf",
      };

      this.loadEditor({
        documentType: config.type,
        mode: "edit",
        title: `新建${config.title}`,
        url: defaultUrls[documentType] || "", // 使用默认空白文档
        isNew: true,
      });
    }, 1000);
  }

  /**
   * 查看文档（如PDF或示例文档）
   */
  viewDocument(type) {
    // 检查是否已经在创建或加载中
    if (this.isCreating || this.isLoading) {
      console.log("正在创建或加载中，忽略查看请求");
      return;
    }

    // 设置加载状态
    this.isLoading = true;

    switch (type) {
      case "word":
        console.log("开始加载 Word 示例文档");
        this.showLoadingOverlay("Word 文档", "正在加载 Word 查看器...");
        setTimeout(() => {
          this.hideLoadingOverlay();
          this.replaceMainContent("Word 文档", "文档查看器已加载完成");
          this.loadEditor({
            documentType: "word",
            mode: "view",
            title: "示例 Word 文档",
            url: "https://moqisoft.github.io/assets/example.docx",
          });
        }, 1000);
        break;

      case "excel":
        console.log("开始加载 Excel 示例文档");
        this.showLoadingOverlay("Excel 表格", "正在加载 Excel 查看器...");
        setTimeout(() => {
          this.hideLoadingOverlay();
          this.replaceMainContent("Excel 表格", "文档查看器已加载完成");
          this.loadEditor({
            documentType: "cell",
            mode: "view",
            title: "示例 Excel 表格",
            url: "https://moqisoft.github.io/assets/example.xlsx",
          });
        }, 1000);
        break;

      case "ppt":
      case "powerpoint":
        console.log("开始加载 PowerPoint 示例文档");
        this.showLoadingOverlay(
          "PowerPoint 演示",
          "正在加载 PowerPoint 查看器..."
        );
        setTimeout(() => {
          this.hideLoadingOverlay();
          this.replaceMainContent("PowerPoint 演示", "文档查看器已加载完成");
          this.loadEditor({
            documentType: "slide",
            mode: "view",
            title: "示例 PowerPoint 演示",
            url: "https://moqisoft.github.io/assets/example.pptx",
          });
        }, 1000);
        break;

      case "pdf":
        console.log("开始加载 PDF 文档");
        this.showLoadingOverlay("PDF 文档", "正在加载 PDF 查看器...");
        setTimeout(() => {
          this.hideLoadingOverlay();
          this.replaceMainContent("PDF 文档", "文档查看器已加载完成");
          this.loadEditor({
            documentType: "pdf",
            mode: "view",
            title: "示例 PDF 文档",
            url: "https://moqisoft.github.io/assets/example.pdf",
          });
        }, 1000);
        break;

      default:
        console.error("不支持的文档类型:", type);
        this.isLoading = false;
        this.showError("不支持的文档类型: " + type);
        break;
    }
  }

  /**
   * 检测设备类型
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // 综合判断：移动设备或小屏幕设备使用mobile模式
    return isMobile || isTablet || isTouchDevice || window.innerWidth <= 768
      ? "mobile"
      : "desktop";
  }

  /**
   * 加载 OnlyOffice 编辑器
   */
  loadEditor(options) {
    const {
      documentType = "text",
      mode = "edit",
      title = "文档",
      url = "",
      isNew = false,
      fileType = null, // 新增参数，用于显式指定文件类型
    } = options;

    // 检查 DocumentAPI 是否可用
    if (typeof DocsAPI === "undefined") {
      console.error("OnlyOffice DocumentAPI 未加载");
      this.showError("文档编辑器加载失败，请刷新页面重试");
      return;
    }

    // 清理之前的编辑器实例
    if (this.documentApi) {
      this.documentApi.destroyEditor();
    }

    // 创建编辑器容器
    const editorContainer = document.querySelector(".content-placeholder");
    if (!editorContainer) {
      console.error("编辑器容器未找到");
      return;
    }

    // 清空容器并设置ID
    editorContainer.innerHTML = "";
    editorContainer.id = "office-editor";

    // 等待下一个渲染帧再获取尺寸，确保容器已经完全渲染
    requestAnimationFrame(() => {
      this.initializeEditor(
        editorContainer,
        options,
        mode,
        documentType,
        title,
        url,
        isNew,
        fileType
      );
    });
  }

  /**
   * 初始化编辑器（在容器渲染完成后调用）
   */
  initializeEditor(
    editorContainer,
    options,
    mode,
    documentType,
    title,
    url,
    isNew,
    fileType
  ) {
    // 计算容器的实际高度（像素值）
    const containerHeight =
      editorContainer.offsetHeight || editorContainer.clientHeight || 600;
    const containerWidth =
      editorContainer.offsetWidth || editorContainer.clientWidth || 800;

    console.log("编辑器容器尺寸:", {
      width: containerWidth,
      height: containerHeight,
    });

    // 自动检测设备类型
    const deviceType = this.detectDeviceType();

    // OnlyOffice 配置
    const config = {
      width: containerWidth + "px",
      height: containerHeight + "px",
      type: mode === "view" ? "view" : deviceType,
      documentType: documentType,
      document: {
        fileType:
          fileType ||
          this.getFileTypeFromUrl(url) ||
          this.getDefaultFileType(documentType),
        key: this.generateDocumentKey(url, isNew),
        title: title,
        url: url || undefined,
        permissions: {
          chat: true,
          comment: true,
          copy: true,
          copyOut: true,
          download: true,
          edit: mode === "edit",
          fillForms: true,
          modifyContentControl: true,
          modifyFilter: true,
          print: true,
          review: true,
          reviewGroups: null,
          commentGroups: {},
          userInfoGroups: null,
          protect: false,
        },
      },
      editorConfig: {
        mode: mode,
        lang: "zh",
        customization: {
          polling: true,
          about: true,
          comments: true,
          close: {
            visible: false,
          },
          feedback: false,
          forcesave: true,
          goback: {
            blank: false,
            url: "https://onlyoffice.moqisoft.com/",
          },
          help: false,
          submitForm: true,
          plugins: true,
          features: {
            spellcheck: false,
          },
          waterMark: {
            value: "文档服务中国版\\nQQ群：183026419",
            fillstyle: "#f00",
            opacity: 0.3,
          },
          mobile: {
            forceView:
              deviceType === "mobile" && mode === "edit" ? false : true,
            showEditingOptionsInView: true,
          },
          compactHeader: deviceType === "mobile",
          toolbarNoTabs: deviceType === "mobile",
          logo: {
            visible: true,
          },
          about: false
        },
        user: {
          group: "",
          id: "user_" + Date.now(),
          image: "https://moqisoft.github.io/assets/avatar.png",
          name: "用户",
        },
        callbackUrl: undefined, // 未配置服务器时不设置
      },
      token: "", // 如需要可配置
      events: {
        onAppReady: () => {
          console.log("编辑器已准备就绪");
          this.isEditorLoaded = true;
          // 重置加载状态
          this.isCreating = false;
          this.isLoading = false;
        },
        onDocumentStateChange: (event) => {
          console.log("文档状态变化:", event);
        },
        onDocumentReady: () => {
          console.log("文档已加载完成");
        },
        onInfo: (event) => {
          console.log("编辑器信息:", event);
        },
        onWarning: (event) => {
          console.warn("编辑器警告:", event);
        },
        onError: (event) => {
          console.error("编辑器错误:", event);
          // 重置加载状态
          this.isCreating = false;
          this.isLoading = false;
          this.showError("文档加载失败: " + (event.data || "未知错误"));
        },
        onRequestSaveAs: (event) => {
          console.log("用户请求另存为:", event);
        },
        onRequestInsertImage: (event) => {
          console.log("用户请求插入图片:", event);
        },
        onRequestMailMergeRecipients: (event) => {
          console.log("邮件合并请求:", event);
        },
        onRequestCompareFile: (event) => {
          console.log("文件比较请求:", event);
        },
        onRequestHistory: (event) => {
          console.log("历史记录请求:", event);
        },
        onRequestHistoryData: (event) => {
          console.log("历史数据请求:", event);
        },
        onRequestHistoryClose: () => {
          console.log("关闭历史记录");
        },
        onRequestRestore: (event) => {
          console.log("恢复文档请求:", event);
        },
      },
    };

    // 创建编辑器实例
    try {
      this.documentApi = new DocsAPI.DocEditor("office-editor", config);
      console.log("OnlyOffice 编辑器已初始化");
    } catch (error) {
      console.error("创建编辑器失败:", error);
      // 重置加载状态
      this.isCreating = false;
      this.isLoading = false;
      this.showError("编辑器初始化失败: " + error.message);
    }
  }

  /**
   * 从URL获取文件类型
   */
  getFileTypeFromUrl(url) {
    if (!url) return null;
    const extension = url.split(".").pop().toLowerCase();
    return extension;
  }

  /**
   * 根据文档类型获取默认文件类型
   */
  getDefaultFileType(documentType) {
    const typeMap = {
      word: "docx",
      cell: "xlsx",
      slide: "pptx",
      pdf: "pdf",
    };
    return typeMap[documentType] || "docx";
  }

  /**
   * 生成文档密钥
   */
  generateDocumentKey(url, isNew) {
    if (isNew) {
      return (
        "new_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      );
    }
    // 对于现有文档，基于URL生成稳定的密钥
    return (
      "doc_" +
      btoa(url || "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substr(0, 20) +
      "_" +
      Date.now()
    );
  }

  /**
   * 显示错误信息
   */
  showError(message) {
    const placeholder = document.querySelector(".content-placeholder");
    if (placeholder) {
      placeholder.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <p class="error-text">${message}</p>
                    <button class="retry-button" onclick="location.reload()">重试</button>
                </div>
            `;
    }
  }

  /**
   * 显示 loading 蒙层
   */
  showLoadingOverlay(title, subtitle) {
    // 移除已存在的 loading 蒙层
    this.hideLoadingOverlay();

    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${title}</div>
                <div class="loading-subtitle">${subtitle}</div>
            </div>
        `;

    document.body.appendChild(overlay);
  }

  /**
   * 隐藏 loading 蒙层
   */
  hideLoadingOverlay() {
    const overlay = document.querySelector(".loading-overlay");
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * 替换主内容区域
   */
  replaceMainContent(title, subtitle) {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    // 显示返回首页按钮
    const backButton = document.querySelector(".back-to-home-button");
    if (backButton) {
      backButton.style.display = "inline-block";
    }

    mainContent.innerHTML = `
            <div class="action-area">
                <div class="content-placeholder">
                    <div class="placeholder-icon">📄</div>
                    <p class="placeholder-text">正在加载文档编辑器...</p>
                </div>
            </div>
        `;
  }

  /**
   * 恢复原始主内容
   */
  restoreMainContent() {
    console.log("恢复主内容到首页");

    // 隐藏返回首页按钮
    const backButton = document.querySelector(".back-to-home-button");
    if (backButton) {
      backButton.style.display = "none";
    }

    // 清理编辑器实例
    if (this.documentApi) {
      this.documentApi.destroyEditor();
      this.documentApi = null;
    }

    // 重置所有状态
    this.isEditorLoaded = false;
    this.isCreating = false;
    this.isLoading = false;
    this.currentDocumentType = null;

    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
            <div class="welcome-section">
                <h1 class="welcome-text">欢迎使用文档服务中国版</h1>
                <p class="subtitle">在浏览器中创建、编辑和协作处理文档</p>
            </div>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📄</div>
                    <div class="feature-title">Word 文档</div>
                    <div class="feature-desc">创建和编辑专业的文档，支持丰富的格式和协作功能</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Excel 表格</div>
                    <div class="feature-desc">处理数据、创建图表和进行复杂的计算分析</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-title">PowerPoint 演示</div>
                    <div class="feature-desc">制作精美的演示文稿，展示您的想法和项目</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📝</div>
                    <div class="feature-title">PDF 文档</div>
                    <div class="feature-desc">创建和编辑 PDF 文档，支持文本、图片和表单等元素</div>
                </div>
            </div>
        `;
  }
}

// 创建全局实例
let officeManager;

// 初始化函数
function initOfficeManager() {
  console.log("初始化 OfficeManager...");
  try {
    officeManager = new OfficeManager();
    // 确保挂载到全局对象
    window.officeManager = officeManager;
    console.log("OfficeManager 初始化完成，实例已挂载到 window.officeManager");
    console.log("实例类型:", typeof window.officeManager);
  } catch (error) {
    console.error("OfficeManager 初始化失败:", error);
  }
}

// 多重保障的初始化机制
function ensureOfficeManager() {
  if (
    !window.officeManager ||
    typeof window.officeManager.handleButtonClick !== "function"
  ) {
    console.log("OfficeManager 实例不存在或不完整，重新创建...");
    initOfficeManager();
  }
  return window.officeManager;
}

// 页面加载完成后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOfficeManager);
} else {
  // DOM 已经加载完成
  initOfficeManager();
}

// 导出给全局使用
window.OfficeManager = OfficeManager;
window.ensureOfficeManager = ensureOfficeManager;
// 注意：不要在这里设置 window.officeManager，因为此时 officeManager 可能还是 undefined
