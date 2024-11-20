### 本项目使用nodejs简单重构自https://github.com/sudojia/comment_backups项目，用于自动备份twikoo评论
### 使用演示
1. Fork本项目或者下载项目并上传private(建议使用private防止评论泄露)
2. 添加Secret
```
TWIKOO_PASSWORD
TWIKOO_URL
```
3. 在Settings/Actions/Workflow permissions中选择Read and write permissions勾选Allow GitHub Actions to create and approve pull requests