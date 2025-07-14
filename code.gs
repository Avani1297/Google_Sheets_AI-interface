const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "{API_key}";
const MODEL = "openai/chatgpt-4o-latest";

const BATCH_SIZE = 50;
const WAIT_BETWEEN_CALLS = 2500;
const ESTIMATED_COST_PER_CALL = 0.0002;
const DRY_RUN = false;


function estimateTokens(text) {
  return Math.ceil(text.length / 4);  // Approx 1 token per 4 characters
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🧠 AI Interface")
    .addItem("▶️ Run Batch", "runBatchAI")
    .addItem("⛔ Stop Batch", "setStopFlag")
    .addItem("⏹️ Reset Progress", "resetBatchProgress")
    .addItem("🧹 Clear Results", "clearOutputs")
    .addToUi();
}

function runBatchAI() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const prompt = sheet.getRange("A1").getValue();
  if (!prompt || prompt.toString().trim() === "") {
    sheet.getRange("C1").setValue("❌ Prompt in A1 is missing.");
    sheet.getRange("D1").setValue("Please enter a valid prompt in cell A1.");
    return;
  }
  const props = PropertiesService.getScriptProperties();

  const lastProcessed = parseInt(props.getProperty("last_row") || "2");
  const startRow = lastProcessed + 1;
  const endRow = Math.min(startRow + BATCH_SIZE - 1, sheet.getLastRow());

  let processed = 0;
  let totalCost = 0;
  const startTime = new Date().getTime();

  sheet.getRange("C1").setValue(`⏳ Processing rows ${startRow}–${endRow}`);
  sheet.getRange("D1").setValue("");

  for (let row = startRow; row <= endRow; row++) {
    // Stop manually
    if (props.getProperty("stop_flag") === "true") {
      sheet.getRange("C1").setValue(`🛑 Manually stopped at row ${row}`);
      props.deleteProperty("stop_flag");
      return;
    }

    // Stop before hitting Apps Script time limit (~5.5 min)
    const elapsed = (new Date().getTime() - startTime) / 1000;
    if (elapsed > 320) {
      sheet.getRange("C1").setValue(`⏸️ Auto-stopped to prevent timeout at row ${row}`);
      props.setProperty("last_row", row - 1);
      return;
    }

    const input = sheet.getRange(row, 1).getValue();
    const outputCell = sheet.getRange(row, 2);
    const progressCell = sheet.getRange(row, 3);
    const errorCell = sheet.getRange(row, 4);

    if (!input || input.trim() === "") {
      progressCell.setValue("⚠️ Skipped (Empty)");
      errorCell.setValue("No input provided.");
      continue;
    }

    if (outputCell.getValue() && !outputCell.getValue().toString().includes("❌")) {
      progressCell.setValue("✅ Already done");
      continue;
    }

    progressCell.setValue("⏳ Processing...");
    errorCell.setValue("");
    SpreadsheetApp.flush();

    if (DRY_RUN) {
      outputCell.setValue("🧪 Test Output");
      progressCell.setValue("✅ Skipped (DRY_RUN)");
      errorCell.setValue("Dry-run mode");
    } else {
      try {
        const fullPrompt = `${prompt}\n\n${input}`;
        const estimatedInputTokens = estimateTokens(fullPrompt);
        const TOKEN_LIMIT = 2048; // adjust based on model used
        const safeMaxTokens = Math.max(100, TOKEN_LIMIT - estimatedInputTokens);

        const payload = {
          model: MODEL,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: fullPrompt }
          ],
          max_tokens: safeMaxTokens,
          temperature: 0.7
        };

        const options = {
          method: "post",
          contentType: "application/json",
          headers: { Authorization: `Bearer ${API_KEY}` },
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        };

        const response = UrlFetchApp.fetch(API_URL, options);
        const code = response.getResponseCode();
        const text = response.getContentText();

        if (code !== 200) {
          throw new Error(`HTTP ${code}: ${text}`);
        }

        const json = JSON.parse(text);
        const result = json?.choices?.[0]?.message?.content;
        if (!result) throw new Error("Missing content in response.");

        outputCell.setValue(result);
        progressCell.setValue("✅ Done");
        errorCell.setValue("");
        processed++;
        totalCost += ESTIMATED_COST_PER_CALL;
      } catch (err) {
        const errMsg = err.message || "Unknown error";
        const brief = errMsg.length > 300 ? errMsg.slice(0, 300) + "..." : errMsg;
        outputCell.setValue("❌ Error");
        progressCell.setValue("⚠️ Failed");
        errorCell.setValue(brief);
      }

      sheet.getRange("C1").setValue(`Progress: Row ${row}`);
      sheet.getRange("D1").setValue(`💰 Est. Cost: $${totalCost.toFixed(3)}`);
      SpreadsheetApp.flush();
      Utilities.sleep(WAIT_BETWEEN_CALLS);
    }
  }

  props.setProperty("last_row", endRow);
  sheet.getRange("C1").setValue(`✅ Batch complete: rows ${startRow}–${endRow}`);
  sheet.getRange("D1").setValue(`💵 Total cost this run: $${totalCost.toFixed(3)}`);
}

function resetBatchProgress() {
  PropertiesService.getScriptProperties().deleteProperty("last_row");
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("C1:D1").setValue("Progress reset");
}

function clearOutputs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  sheet.getRange(3, 2, lastRow - 2, 3).clearContent(); // Clear B, C, D
  sheet.getRange("C1:D1").clearContent();
  PropertiesService.getScriptProperties().deleteProperty("last_row");
}

function setStopFlag() {
  PropertiesService.getScriptProperties().setProperty("stop_flag", "true");
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("C1").setValue("🛑 Stop requested...");
}
