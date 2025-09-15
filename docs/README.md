# BlogFlow 项目文档

## 📚 文档导航

### 🎯 项目概览
- **README.md** - 项目介绍和快速开始指南
- **QUICK_SETUP.md** - 快速部署说明

### 📖 使用文档  
- **docs/USER_GUIDE.md** - 用户系统使用指南
- **docs/CONFIG_GUIDE.md** - 站点配置说明

### 🔌 开发文档
- **docs/BACKEND_API.md** - 后端API开发规范（重要）

## 🎯 给后端开发者

如果你是后端开发者，建议按以下顺序阅读：

1. **README.md** - 了解项目功能和技术栈
2. **docs/BACKEND_API.md** - 详细的API接口规范和数据模型
3. **docs/CONFIG_GUIDE.md** - 了解前端配置结构
4. **docs/USER_GUIDE.md** - 了解用户系统和权限设计

重点关注 `docs/BACKEND_API.md`，这里包含了完整的：
- 📊 数据模型设计
- 🔌 API接口规范  
- 🔐 认证授权方案
- 🛡️ 权限系统设计
- 📈 性能要求
- 🗄️ 数据库设计建议

## 📁 项目结构概览

```
BlogFlow/
├── README.md              # 项目主文档
├── QUICK_SETUP.md         # 快速部署
├── docs/                  # 文档目录
│   ├── BACKEND_API.md     # 后端开发文档 ⭐
│   ├── USER_GUIDE.md      # 用户使用指南
│   └── CONFIG_GUIDE.md    # 配置说明
├── app/                   # 前端源码
├── config/                # 配置文件
└── content/               # 内容文件
```

## 🚀 快速开始

### 前端开发者
```bash
npm install
npm run dev
```

### 后端开发者
1. 阅读 `docs/BACKEND_API.md`
2. 实现API接口
3. 测试与前端对接

---

**文档维护**: 📝 持续更新  
**版本**: v1.0  
**状态**: ✅ 完成