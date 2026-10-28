export interface KnowledgePublicItem {
  knowledgeId: number;
  organId?: number;
  categoryId?: number;
  knowledgeKey?: string;
  knowledgeName?: string;
  knowledgeType?: string;
  description?: string;
  visibility?: string;
  activeRevisionId?: number;
  revisionNo?: string;
}

export interface KnowledgePublicCategory {
  organId?: number;
  categoryId?: number;
  categoryName?: string;
  knowledgeCount?: number;
}

export interface KnowledgePublicBody {
  knowledgeId?: number;
  revisionId?: number;
  chunkId?: number;
  organId?: number;
  categoryId?: number;
  visibility?: string;
  content?: string;
  title?: string;
  citation?: string;
  revisionNo?: string;
}
