import { app } from "../../scripts/app.js";

// Keep this list in sync with nodes.py and retain old entries verbatim.
const RESOLUTIONS = {
    // SD 1.5
    '▯ 512×896 (9:16)': [512, 896],
    '▯ 512×768 (2:3)': [512, 768],
    '▯ 480×640 (3:4)': [480, 640],
    '□ 512×512 (1:1)': [512, 512],
    '▭ 640×480 (4:3)': [640, 480],
    '▭ 768×512 (3:2)': [768, 512],
    '▭ 896×512 (16:9)': [896, 512],
    // SDXL
    '▯ 640×1536 (SDXL - 9:21)': [640, 1536],
    '▯ 768×1344 (SDXL - 9:16)': [768, 1344],
    '▯ 832×1216 (SDXL - 2:3)': [832, 1216],
    '▯ 896×1152 (SDXL - 3:4)': [896, 1152],
    '□ 1024×1024 (SDXL - 1:1)': [1024, 1024],
    '▭ 1152×896 (SDXL - 4:3)': [1152, 896],
    '▭ 1216×832 (SDXL - 3:2)': [1216, 832],
    '▭ 1344×768 (SDXL - 16:9)': [1344, 768],
    '▭ 1536×640 (SDXL - 21:9)': [1536, 640],
    // HD 720p
    '▯ 720×1680 (HD - 9:21)': [720, 1680],
    '▯ 720×1280 (HD - 9:16)': [720, 1280],
    '▯ 720×1080 (HD - 2:3)': [720, 1080],
    '▯ 720×960 (HD - 3:4)': [720, 960],
    '▯ 720×896 (HD - 4:5)': [720, 896],
    '□ 720×720 (HD - 1:1)': [720, 720],
    '▭ 896×720 (HD - 5:4)': [896, 720],
    '▭ 960×720 (HD - 4:3)': [960, 720],
    '▭ 1080×720 (HD - 3:2)': [1080, 720],
    '▭ 1280×720 (HD - 16:9)': [1280, 720],
    '▭ 1680×720 (HD - 21:9)': [1680, 720],
    // FHD 1080p
    '▯ 1080×2520 (FHD - 9:21)': [1080, 2520],
    '▯ 1080×1920 (FHD - 9:16)': [1080, 1920],
    '▯ 1080×1624 (FHD - 2:3)': [1080, 1624],
    '▯ 1080×1440 (FHD - 3:4)': [1080, 1440],
    '▯ 1080×1352 (FHD - 4:5)': [1080, 1352],
    '□ 1080×1080 (FHD - 1:1)': [1080, 1080],
    '▭ 1352×1080 (FHD - 5:4)': [1352, 1080],
    '▭ 1440×1080 (FHD - 4:3)': [1440, 1080],
    '▭ 1624×1080 (FHD - 3:2)': [1624, 1080],
    '▭ 1920×1080 (FHD - 16:9)': [1920, 1080],
    '▭ 2520×1080 (FHD - 21:9)': [2520, 1080],
    // 2K
    '▯ 880×2048 (2K - 9:21)': [880, 2048],
    '▯ 1152×2048 (2K - 9:16)': [1152, 2048],
    '▯ 1360×2048 (2K - 2:3)': [1360, 2048],
    '▯ 1536×2048 (2K - 3:4)': [1536, 2048],
    '▯ 1632×2048 (2K - 4:5)': [1632, 2048],
    '□ 2048×2048 (2K - 1:1)': [2048, 2048],
    '▭ 2048×1632 (2K - 5:4)': [2048, 1632],
    '▭ 2048×1536 (2K - 4:3)': [2048, 1536],
    '▭ 2048×1360 (2K - 3:2)': [2048, 1360],
    '▭ 2048×1152 (2K - 16:9)': [2048, 1152],
    '▭ 2048×880 (2K - 21:9)': [2048, 880],
    // QHD
    '▯ 1440×2560 (QHD - 9:16)': [1440, 2560],
    '▯ 1712×2560 (QHD - 2:3)': [1712, 2560],
    '▯ 1920×2560 (QHD - 3:4)': [1920, 2560],
    '□ 2560×2560 (QHD - 1:1)': [2560, 2560],
    '▭ 2560×1920 (QHD - 4:3)': [2560, 1920],
    '▭ 2560×1712 (QHD - 3:2)': [2560, 1712],
    '▭ 2560×1440 (QHD - 16:9)': [2560, 1440],
    // 4K
    '▯ 1648×3840 (4K UHD - 9:21)': [1648, 3840],
    '▯ 2160×3840 (4K UHD - 9:16)': [2160, 3840],
    '▯ 2560×3840 (4K UHD - 2:3)': [2560, 3840],
    '▯ 2880×3840 (4K UHD - 3:4)': [2880, 3840],
    '▯ 3072×3840 (4K UHD - 4:5)': [3072, 3840],
    '□ 4096×4096 (4K - 1:1)': [4096, 4096],
    '▭ 3840×3072 (4K UHD - 5:4)': [3840, 3072],
    '▭ 3840×2880 (4K UHD - 4:3)': [3840, 2880],
    '▭ 3840×2560 (4K UHD - 3:2)': [3840, 2560],
    '▭ 3840×2160 (4K UHD - 16:9)': [3840, 2160],
    '▭ 3840×1648 (4K UHD - 21:9)': [3840, 1648],
};

app.registerExtension({
    name: "EmptyLatentAdvancedSelector",

    async nodeCreated(node) {
        if (node.comfyClass !== "EmptyLatentAdvancedSelector") return;
        const findWidget = (name) => node.widgets?.find(w => w.name === name);
        const widgets = {
            preset: findWidget("Resolution"),
            mode: findWidget("Mode"),
            ratioLock: findWidget("Ratio Lock"),
            width: findWidget("Width"),
            height: findWidget("Height"),
            batch: findWidget("Batch Size"),
            latentType: findWidget("Latent Type"),
            filter: findWidget("Filter"),
        };
        if (!widgets.preset || !widgets.mode || !widgets.width || !widgets.height) return;

        let isUpdating = false;
        let lastChangedDimension = "Width";
        // Preserve the original backend/serialized order to avoid breaking
        // saved workflows. Only change the visual order of the Filter widget.
        // LiteGraph serializes values by widget index, so we explicitly map
        // their original order in onSerialize/onConfigure below.
        const storageOrder = [
            "Resolution", "Mode", "Ratio Lock", "Width", "Height",
            "Batch Size", "Latent Type", "Filter",
        ];
        const defaultValues = Object.fromEntries(
            storageOrder.map(name => [name, findWidget(name)?.value])
        );
        if (widgets.filter) {
            const index = node.widgets.indexOf(widgets.filter);
            if (index > 0) {
                node.widgets.splice(index, 1);
                node.widgets.unshift(widgets.filter);
            }
        }

        const allResolutions = Object.keys(RESOLUTIONS);
        const presetSize = () => RESOLUTIONS[widgets.preset.value] || [832, 1216];
        const alignStep = () => widgets.latentType?.value?.startsWith("Flux 2") ? 16 : 8;
        const roundSize = (value) => {
            const step = alignStep();
            return Math.max(64, Math.min(16384, Math.round(value / step) * step));
        };
        const getAspectRatio = () => {
            const [w, h] = presetSize();
            return w / h;
        };

        function calculateDimension(changedDimension) {
            if (isUpdating || widgets.mode.value !== "Override" || !widgets.ratioLock?.value) return;
            isUpdating = true;
            const ratio = getAspectRatio();
            if (changedDimension === "Width") {
                widgets.width.value = roundSize(widgets.width.value);
                widgets.height.value = roundSize(widgets.width.value / ratio);
            } else {
                widgets.height.value = roundSize(widgets.height.value);
                widgets.width.value = roundSize(widgets.height.value * ratio);
            }
            isUpdating = false;
        }

        // Preserve the original compact UI. The new Latent Type selector is
        // always visible; Width/Height/Ratio Lock are hidden in preset mode.
        function toggleWidget(widget, show) {
            if (!widget) return;
            if (show) {
                if (widget.origType) widget.type = widget.origType;
                delete widget.computeSize;
            } else {
                if (!widget.origType) widget.origType = widget.type;
                widget.type = "HIDDEN";
                widget.computeSize = () => [0, -4];
            }
        }

        function updateLayout() {
            const isOverride = widgets.mode.value === "Override";
            [widgets.ratioLock, widgets.width, widgets.height].forEach(w => toggleWidget(w, isOverride));
            const size = node.computeSize();
            node.setSize([node.size[0], size[1] + 4]);
            app.graph?.setDirtyCanvas(true, true);
        }

        function wrapCallback(widget, handler) {
            if (!widget) return;
            const previous = widget.callback;
            widget.callback = function(value) {
                previous?.call(this, value);
                if (!isUpdating) handler(value);
            };
        }

        function applyPreset() {
            const [w, h] = presetSize();
            isUpdating = true;
            widgets.width.value = roundSize(w);
            widgets.height.value = roundSize(h);
            isUpdating = false;
        }


        function presetCategory(label) {
            if (label.includes("(SDXL - ")) return "SDXL";
            if (label.includes("(HD - ")) return "HD 720p";
            if (label.includes("(FHD - ")) return "FHD 1080p";
            if (label.includes("(2K - ")) return "2K";
            if (label.includes("(QHD - ")) return "QHD";
            if (label.includes("(4K UHD - ") || label.includes("(4K - ")) return "4K";
            return "SD 1.5";
        }

        // Filter only the visible combo choices. The backend always accepts
        // the complete preset list, including values from older workflows.
        function updatePresetFilter() {
            const category = widgets.filter?.value || "All";
            const available = category === "All"
                ? allResolutions.slice()
                : allResolutions.filter(label => presetCategory(label) === category);
            if (!available.length) return;

            widgets.preset.options.values = available;
            if (!available.includes(widgets.preset.value)) {
                // Switching groups selects their first resolution; switching
                // back to All retains the current resolution.
                isUpdating = true;
                widgets.preset.value = available[0];
                isUpdating = false;
                // Selecting a category also selects a new preset, even if
                // the node is in manual Override mode.
                applyPreset();
            }
            app.graph?.setDirtyCanvas(true, true);
        }

        wrapCallback(widgets.preset, () => {
            // A deliberate preset selection must populate the manual fields
            // regardless of Mode or Ratio Lock.
            applyPreset();
        });
        wrapCallback(widgets.mode, () => {
            if (widgets.mode.value === "Use Preset") applyPreset();
            else calculateDimension("Width");
            updateLayout();
        });
        wrapCallback(widgets.ratioLock, () => {
            if (widgets.ratioLock?.value) calculateDimension(lastChangedDimension);
        });
        wrapCallback(widgets.width, () => {
            lastChangedDimension = "Width";
            calculateDimension("Width");
        });
        wrapCallback(widgets.height, () => {
            lastChangedDimension = "Height";
            calculateDimension("Height");
        });
        wrapCallback(widgets.latentType, () => {
            if (widgets.mode.value === "Use Preset") applyPreset();
            else if (widgets.ratioLock?.value) calculateDimension(lastChangedDimension);
            else {
                isUpdating = true;
                widgets.width.value = roundSize(widgets.width.value);
                widgets.height.value = roundSize(widgets.height.value);
                isUpdating = false;
            }
        });

        wrapCallback(widgets.filter, () => updatePresetFilter());

        // Widget order in the UI is now Filter, Resolution, Mode, etc., but
        // disk serialization remains in the original v3 order. This keeps
        // existing saved workflows compatible with the reordered UI.
        const oldOnSerialize = node.onSerialize;
        node.onSerialize = function(data) {
            const result = oldOnSerialize?.call(this, data);
            if (data && Array.isArray(data.widgets_values)) {
                data.widgets_values = storageOrder.map(name => findWidget(name)?.value);
            }
            return result;
        };

        // LiteGraph restores saved values by *visual* widget index, which is
        // different after moving Filter. Correct it by the stored positions.
        // This also supports older v1/v2 workflows with 6 or 7 values.
        const oldOnConfigure = node.onConfigure;
        node.onConfigure = function(data, ...args) {
            const result = oldOnConfigure?.call(this, data, ...args);
            if (Array.isArray(data?.widgets_values)) {
                isUpdating = true;
                for (let i = 0; i < storageOrder.length; i++) {
                    const name = storageOrder[i];
                    const widget = findWidget(name);
                    if (widget) {
                        widget.value = i < data.widgets_values.length &&
                            data.widgets_values[i] !== undefined
                            ? data.widgets_values[i]
                            : defaultValues[name];
                    }
                }
                isUpdating = false;
            }
            setTimeout(() => {
                updatePresetFilter();
                updateLayout();
                // Keep manually entered override dimensions when reopening.
                if (widgets.mode.value === "Use Preset") applyPreset();
            }, 0);
            return result;
        };

        // Comfy restores saved widget values when a workflow is loaded.
        // Layout is delayed to allow restoration to complete.
        setTimeout(() => {
            updatePresetFilter();
            updateLayout();
            if (widgets.mode.value === "Use Preset") applyPreset();
        }, 100);
    },
});
