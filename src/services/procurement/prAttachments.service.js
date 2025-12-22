import * as model from "../../models/Procurement/pr_attachments.model.js";

export const addPRAttachmentService = async (data) => {
  if (!data.pr_id || !data.file_name || !data.file_path)
    return {
      success: false,
      message: "PR ID, file name, and file path required",
    };

  const attachment = await model.addPRAttachment(data);
  return { success: true, data: attachment };
};

export const getPRAttachmentsService = async (pr_id) => {
  const attachments = await model.getPRAttachmentsByPR(pr_id);
  return { success: true, data: attachments };
};
