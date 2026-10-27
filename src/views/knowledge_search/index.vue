<template>
  <div class="knowledge_search-page">
    <div class="knowledge_search-page__header">
      <h2>效果验证</h2>
      <el-tag type="info">默认问答验证</el-tag>
    </div>

    <el-card shadow="never" class="knowledge_search-page__panel">
      <el-form label-width="96px" @submit.prevent>
        <el-form-item label="验证方式">
          <el-select v-model="verifyMode" style="width: 200px" @change="onModeChange">
            <el-option label="问答验证" value="answer" />
            <el-option label="检索验证" value="retrieve" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题">
          <el-input
            v-model="form.query"
            type="textarea"
            :rows="3"
            maxlength="2000"
            show-word-limit
            placeholder="输入要验证的问题"
          />
        </el-form-item>
        <el-form-item v-if="isAnswerMode" label="回复模板">
          <el-select v-model="form.templateCode" filterable placeholder="选择启用模板" style="width: 320px">
            <el-option
              v-for="tpl in templates"
              :key="tpl.templateCode"
              :label="`${tpl.templateName}（${tpl.templateCode}）`"
              :value="tpl.templateCode"
            />
          </el-select>
          <div class="field-tip">模板编码不是模型名称</div>
        </el-form-item>

        <el-collapse v-model="advancedOpen">
          <el-collapse-item title="高级选项" name="advanced">
            <el-form-item label="全部命中标签">
              <el-select v-model="form.allTagCodes" multiple filterable clearable style="width: 100%">
                <el-option
                  v-for="tag in tags"
                  :key="tag.tagCode"
                  :label="`${tag.tagName}（${tag.tagCode}）`"
                  :value="tag.tagCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="任一命中标签">
              <el-select v-model="form.anyTagCodes" multiple filterable clearable style="width: 100%">
                <el-option
                  v-for="tag in tags"
                  :key="tag.tagCode"
                  :label="`${tag.tagName}（${tag.tagCode}）`"
                  :value="tag.tagCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="topK">
              <el-input-number v-model="form.topK" :min="1" :max="50" controls-position="right" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <el-form-item>
          <el-button
            v-if="isAnswerMode"
            type="primary"
            :loading="loading"
            v-permission="'knowledge_search:answer'"
            @click="runVerify"
          >
            开始验证
          </el-button>
          <el-button
            v-else
            type="primary"
            :loading="loading"
            v-permission="'knowledge_search:retrieve'"
            @click="runVerify"
          >
            开始验证
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="result" shadow="never" class="knowledge_search-page__result">
      <template v-if="isAnswerMode">
        <h3>回答</h3>
        <el-alert
          v-if="!result.answerable"
          type="warning"
          :closable="false"
          show-icon
          :title="unanswerableTitle"
        />
        <pre v-else class="answer-text">{{ answerResult?.answer || '-' }}</pre>
      </template>
      <template v-else>
        <h3>命中证据</h3>
        <el-alert
          v-if="!result.answerable"
          type="warning"
          :closable="false"
          show-icon
          :title="unanswerableTitle"
        />
      </template>

      <div v-if="(result.sources || []).length" class="sources">
        <h4>{{ isAnswerMode ? '引用依据' : '检索结果' }}</h4>
        <el-collapse>
          <el-collapse-item
            v-for="(src, idx) in result.sources"
            :key="`${src.chunkId}-${idx}`"
            :title="sourceTitle(src, idx)"
          >
            <pre class="source-content">{{ src.content }}</pre>
            <div class="source-meta">
              <span>版本：{{ src.revisionNo || '-' }}</span>
              <span>页码：{{ src.page ?? '-' }}</span>
              <span>引用：{{ src.citation || '-' }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-collapse class="diag">
        <el-collapse-item title="诊断信息" name="diag">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="可回答">{{ result.answerable ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="原因码">{{ result.reasonCode || '-' }}</el-descriptions-item>
            <el-descriptions-item label="traceId">{{ result.traceId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="证据得分">
              <div v-for="(src, idx) in result.sources || []" :key="`score-${idx}`">
                #{{ idx + 1 }}：{{ src.score ?? '-' }}
              </div>
              <span v-if="!(result.sources || []).length">-</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { KnowledgeSearchApi } from './api';
import type { KnowledgeAnswerResult, KnowledgeEvidence, KnowledgeRetrieveResult } from './type';
import { KnowledgeAnswerTemplateApi } from '@/views/knowledge_answer_template/api';
import type { KnowledgeAnswerTemplate } from '@/views/knowledge_answer_template/type';
import { KnowledgeTagApi } from '@/views/knowledge_tag/api';
import type { KnowledgeTag } from '@/views/knowledge_tag/type';

type VerifyMode = 'answer' | 'retrieve';

const verifyMode = ref<VerifyMode>('answer');
const loading = ref(false);
const advancedOpen = ref<string[]>([]);
const templates = ref<KnowledgeAnswerTemplate[]>([]);
const tags = ref<KnowledgeTag[]>([]);
const result = ref<KnowledgeRetrieveResult | KnowledgeAnswerResult | null>(null);

const form = reactive({
  query: '',
  templateCode: 'DEFAULT',
  allTagCodes: [] as string[],
  anyTagCodes: [] as string[],
  topK: undefined as number | undefined,
});

const isAnswerMode = computed(() => verifyMode.value === 'answer');
const answerResult = computed(() => result.value as KnowledgeAnswerResult | null);

const unanswerableTitle = computed(() => {
  if (!result.value) return '不可回答';
  if (result.value.reasonCode) {
    return `服务端不可回答（${result.value.reasonCode}）。配置错误不会被展示为无证据。`;
  }
  return '服务端返回不可回答结果';
});

const sourceTitle = (src: KnowledgeEvidence, idx: number) => {
  const title = src.title || src.section || `证据 #${idx + 1}`;
  return title;
};

const onModeChange = () => {
  result.value = null;
};

const runVerify = async () => {
  if (!form.query.trim()) {
    ElMessage.warning('请输入问题');
    return;
  }
  loading.value = true;
  result.value = null;
  try {
    const payload = {
      query: form.query.trim(),
      allTagCodes: form.allTagCodes.length ? form.allTagCodes : undefined,
      anyTagCodes: form.anyTagCodes.length ? form.anyTagCodes : undefined,
      topK: form.topK,
    };
    if (isAnswerMode.value) {
      result.value = await KnowledgeSearchApi.answer({
        ...payload,
        templateCode: form.templateCode || 'DEFAULT',
      });
    } else {
      result.value = await KnowledgeSearchApi.retrieve(payload);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    templates.value = (await KnowledgeAnswerTemplateApi.list({ status: 'ACTIVE' })).filter(
      (t) => t.status === 'ACTIVE',
    );
    if (!templates.value.find((t) => t.templateCode === form.templateCode) && templates.value[0]) {
      form.templateCode = templates.value[0].templateCode;
    }
  } catch {
    templates.value = [];
  }
  try {
    tags.value = await KnowledgeTagApi.list({ status: 'ACTIVE' });
  } catch {
    tags.value = [];
  }
});
</script>

<style scoped>
.knowledge_search-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  box-sizing: border-box;
}
.knowledge_search-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_search-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_search-page__panel,
.knowledge_search-page__result {
  margin-top: 12px;
  background-color: var(--g2-bg-container);
}
.field-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.answer-text,
.source-content {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: inherit;
  line-height: 1.6;
}
.sources {
  margin-top: 16px;
}
.source-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.diag {
  margin-top: 16px;
}
</style>
