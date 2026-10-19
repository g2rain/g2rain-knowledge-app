export interface KnowledgeEvidence {
  knowledgeId?: number;
  revisionId?: number;
  chunkId?: number;
  content?: string;
  title?: string;
  section?: string;
  page?: number;
  revisionNo?: string;
  citation?: string;
  score?: number;
}

export interface KnowledgeRetrievePayload {
  query: string;
  allTagCodes?: string[];
  anyTagCodes?: string[];
  topK?: number;
}

export interface KnowledgeAnswerPayload extends KnowledgeRetrievePayload {
  templateCode?: string;
}

export interface KnowledgeRetrieveResult {
  answerable: boolean;
  traceId?: string;
  reasonCode?: string;
  sources?: KnowledgeEvidence[];
}

export interface KnowledgeAnswerResult extends KnowledgeRetrieveResult {
  answer?: string;
}
