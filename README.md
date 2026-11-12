# Empty Latent Advanced Plus for ComfyUI

An extended version of **Empty Latent Advanced** with **67 resolution presets**, a category filter, model-aware empty latents and a compact UI.

> **Credits:** Based on [ComfyUI-Empty-Latent-Advanced](https://github.com/amenorira/ComfyUI-Empty-Latent-Advanced) by ameyukisora (copyright 2025), distributed under the MIT License. This is a community modification, not an official update from the original author. The original copyright and license are retained in [`LICENSE`](LICENSE).

## Features

- **67 presets** grouped by **SD 1.5, SDXL, HD 720p, FHD 1080p, 2K, QHD and 4K**.
- **Filter above Resolution**: switch between categories without scrolling through the full list.
- **Aspect ratios**: the HD, FHD, 2K and 4K groups include 9:21, 9:16, 2:3, 3:4, 4:5, 1:1, 5:4, 4:3, 3:2, 16:9 and 21:9 (QHD has seven ratios).
- **Model-aware Latent Type** selector with three formats:

  | Latent Type | Channels | Spatial downscale |
  |---|---:|---:|
  | SD 1.5 / SDXL | 4 | 8× |
  | SD3 / Flux 1 / Qwen | 16 | 8× |
  | Flux 2 / Klein | 128 | 16× |

- **Override mode** for manual Width and Height; optional **Ratio Lock**.
- Selecting a resolution updates the manual Width / Height fields even when Override mode is active.
- Retains the original **Latent**, **Width** and **Height** outputs and the node identifier `EmptyLatentAdvancedSelector`.
- Preserves previous workflow widget storage order despite moving Filter visually above Resolution.

## Installation

**If the original Empty Latent Advanced is installed**, close ComfyUI and back up its folder first. **Do not install both editions at the same time**: both register the same node type.

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/dar06051990-oss/ComfyUI-Empty-Latent-Advanced-Plus.git
```

Alternatively, download this repository as ZIP and extract it inside `ComfyUI/custom_nodes/`.

Restart ComfyUI and hard-refresh your browser (`Ctrl+F5`) to reload the custom JavaScript.

> The clone URL above will work **after this repository has been created and published**.

## Usage

1. Add **Latent → 📐 Empty Latent Advanced**.
2. Pick **Filter** (e.g. `4K`) and then **Resolution**.
3. Choose the correct **Latent Type** for the model used by your workflow.
4. Leave **Mode** as `Use Preset`, or set it to `Override` to enter custom dimensions.
5. Connect **Latent** to the appropriate latent input of your workflow; optionally connect **Width** and **Height** to nodes requiring image dimensions.

**Important:** Model type is selected manually; it is not auto-detected from the loaded checkpoint. This node only prepares an empty spatial latent: it does **not** convert models, add video/temporal latent support, or guarantee compatibility with arbitrary workflows.

### Flux 2 and dimensions

Flux 2 uses a 16× spatial downscale. Requested dimensions that are not multiples of 16 are aligned to the nearest supported size; the Width/Height outputs report the **actual generated dimensions**. For example, `1920×1080` yields `1920×1088` with Flux 2.

### Performance note

Generating at 2K/4K can require substantially more VRAM. The presence of a preset does not guarantee the selected model can generate that resolution on the available GPU.

## Compatibility

- ComfyUI with PyTorch installed (no extra Python dependencies beyond the usual ComfyUI environment).
- The original node type, original preset labels and original outputs are retained.
- Saved workflows created with older versions are intended to remain compatible. If you keep both editions installed, duplicate node registration may cause conflicts.

## Tests

Local smoke checks cover 67 presets across three latent formats, aspect-ratio override behavior, filter switching, and workflow value serialization. Run with an existing PyTorch environment and Node.js:

```bash
python tests/test_latent.py
node tests/test_ui.cjs
```

## Credits and license

Original project: [amenorira / ComfyUI-Empty-Latent-Advanced](https://github.com/amenorira/ComfyUI-Empty-Latent-Advanced), by **ameyukisora**. Original copyright: **© 2025 ameyukisora**. Original MIT License preserved. See [`LICENSE`](LICENSE).

Modified edition prepared for the `dar06051990-oss` GitHub account.
