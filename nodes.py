"""Empty Latent Advanced — extended resolutions, filtered presets, model-aware latents.

Based on ComfyUI-Empty-Latent-Advanced by ameyukisora (MIT license).
"""

import torch


class EmptyLatentAdvancedSelector:
    """Resolution selection + a correctly shaped empty latent for each model family."""

    # Keep existing names and order: stored workflows reference these exact strings.
    RESOLUTIONS = {
        # SD 1.5
        '▯ 512×896 (9:16)': (512, 896),
        '▯ 512×768 (2:3)': (512, 768),
        '▯ 480×640 (3:4)': (480, 640),
        '□ 512×512 (1:1)': (512, 512),
        '▭ 640×480 (4:3)': (640, 480),
        '▭ 768×512 (3:2)': (768, 512),
        '▭ 896×512 (16:9)': (896, 512),
        # SDXL
        '▯ 640×1536 (SDXL - 9:21)': (640, 1536),
        '▯ 768×1344 (SDXL - 9:16)': (768, 1344),
        '▯ 832×1216 (SDXL - 2:3)': (832, 1216),
        '▯ 896×1152 (SDXL - 3:4)': (896, 1152),
        '□ 1024×1024 (SDXL - 1:1)': (1024, 1024),
        '▭ 1152×896 (SDXL - 4:3)': (1152, 896),
        '▭ 1216×832 (SDXL - 3:2)': (1216, 832),
        '▭ 1344×768 (SDXL - 16:9)': (1344, 768),
        '▭ 1536×640 (SDXL - 21:9)': (1536, 640),
        # HD 720p
        '▯ 720×1680 (HD - 9:21)': (720, 1680),
        '▯ 720×1280 (HD - 9:16)': (720, 1280),
        '▯ 720×1080 (HD - 2:3)': (720, 1080),
        '▯ 720×960 (HD - 3:4)': (720, 960),
        '▯ 720×896 (HD - 4:5)': (720, 896),
        '□ 720×720 (HD - 1:1)': (720, 720),
        '▭ 896×720 (HD - 5:4)': (896, 720),
        '▭ 960×720 (HD - 4:3)': (960, 720),
        '▭ 1080×720 (HD - 3:2)': (1080, 720),
        '▭ 1280×720 (HD - 16:9)': (1280, 720),
        '▭ 1680×720 (HD - 21:9)': (1680, 720),
        # FHD 1080p
        '▯ 1080×2520 (FHD - 9:21)': (1080, 2520),
        '▯ 1080×1920 (FHD - 9:16)': (1080, 1920),
        '▯ 1080×1624 (FHD - 2:3)': (1080, 1624),
        '▯ 1080×1440 (FHD - 3:4)': (1080, 1440),
        '▯ 1080×1352 (FHD - 4:5)': (1080, 1352),
        '□ 1080×1080 (FHD - 1:1)': (1080, 1080),
        '▭ 1352×1080 (FHD - 5:4)': (1352, 1080),
        '▭ 1440×1080 (FHD - 4:3)': (1440, 1080),
        '▭ 1624×1080 (FHD - 3:2)': (1624, 1080),
        '▭ 1920×1080 (FHD - 16:9)': (1920, 1080),
        '▭ 2520×1080 (FHD - 21:9)': (2520, 1080),
        # 2K
        '▯ 880×2048 (2K - 9:21)': (880, 2048),
        '▯ 1152×2048 (2K - 9:16)': (1152, 2048),
        '▯ 1360×2048 (2K - 2:3)': (1360, 2048),
        '▯ 1536×2048 (2K - 3:4)': (1536, 2048),
        '▯ 1632×2048 (2K - 4:5)': (1632, 2048),
        '□ 2048×2048 (2K - 1:1)': (2048, 2048),
        '▭ 2048×1632 (2K - 5:4)': (2048, 1632),
        '▭ 2048×1536 (2K - 4:3)': (2048, 1536),
        '▭ 2048×1360 (2K - 3:2)': (2048, 1360),
        '▭ 2048×1152 (2K - 16:9)': (2048, 1152),
        '▭ 2048×880 (2K - 21:9)': (2048, 880),
        # QHD
        '▯ 1440×2560 (QHD - 9:16)': (1440, 2560),
        '▯ 1712×2560 (QHD - 2:3)': (1712, 2560),
        '▯ 1920×2560 (QHD - 3:4)': (1920, 2560),
        '□ 2560×2560 (QHD - 1:1)': (2560, 2560),
        '▭ 2560×1920 (QHD - 4:3)': (2560, 1920),
        '▭ 2560×1712 (QHD - 3:2)': (2560, 1712),
        '▭ 2560×1440 (QHD - 16:9)': (2560, 1440),
        # 4K
        '▯ 1648×3840 (4K UHD - 9:21)': (1648, 3840),
        '▯ 2160×3840 (4K UHD - 9:16)': (2160, 3840),
        '▯ 2560×3840 (4K UHD - 2:3)': (2560, 3840),
        '▯ 2880×3840 (4K UHD - 3:4)': (2880, 3840),
        '▯ 3072×3840 (4K UHD - 4:5)': (3072, 3840),
        '□ 4096×4096 (4K - 1:1)': (4096, 4096),
        '▭ 3840×3072 (4K UHD - 5:4)': (3840, 3072),
        '▭ 3840×2880 (4K UHD - 4:3)': (3840, 2880),
        '▭ 3840×2560 (4K UHD - 3:2)': (3840, 2560),
        '▭ 3840×2160 (4K UHD - 16:9)': (3840, 2160),
        '▭ 3840×1648 (4K UHD - 21:9)': (3840, 1648),
    }

    # Keep the old default and append the new widget LAST to preserve the
    # ordering of saved ComfyUI widgets_values in existing workflows.
    LATENT_TYPES = {
        "SD 1.5 / SDXL (4ch)": (4, 8),
        "SD3 / Flux 1 / Qwen (16ch)": (16, 8),
        "Flux 2 / Klein (128ch)": (128, 16),
    }
    DEFAULT_LATENT_TYPE = "SD 1.5 / SDXL (4ch)"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "Resolution": (list(cls.RESOLUTIONS.keys()), {"default": "▯ 832×1216 (SDXL - 2:3)"}),
                "Mode": (["Use Preset", "Override"], {"default": "Use Preset"}),
                "Ratio Lock": ("BOOLEAN", {"default": True, "label_on": "On", "label_off": "Off"}),
                "Width": ("INT", {"default": 832, "min": 64, "max": 16384, "step": 8}),
                "Height": ("INT", {"default": 1216, "min": 64, "max": 16384, "step": 8}),
                "Batch Size": ("INT", {"default": 1, "min": 1, "max": 64}),
                "Latent Type": (list(cls.LATENT_TYPES.keys()), {"default": cls.DEFAULT_LATENT_TYPE}),
                "Filter": (["All", "SD 1.5", "SDXL", "HD 720p", "FHD 1080p", "2K", "QHD", "4K"], {"default": "All"}),
            }
        }

    RETURN_TYPES = ("LATENT", "INT", "INT")
    RETURN_NAMES = ("Latent", "Width", "Height")
    FUNCTION = "generate"
    CATEGORY = "latent"

    @staticmethod
    def _align(value, multiple):
        # round-half-up instead of Python banker's rounding
        return max(64, min(16384, int((float(value) / multiple) + 0.5) * multiple))

    def generate(self, Resolution, Mode, Width, Height, **kwargs):
        ratio_lock = kwargs.get("Ratio Lock", True)
        batch_size = kwargs.get("Batch Size", 1)
        latent_type = kwargs.get("Latent Type", self.DEFAULT_LATENT_TYPE)
        if latent_type not in self.LATENT_TYPES:
            raise ValueError(f"Empty Latent Advanced: unknown Latent Type: {latent_type}")

        channels, downscale = self.LATENT_TYPES[latent_type]
        preset_width, preset_height = self.RESOLUTIONS[Resolution]

        if Mode == "Use Preset":
            width, height = preset_width, preset_height
        elif Mode == "Override":
            width = Width
            height = (float(Width) * preset_height / preset_width) if ratio_lock else Height
        else:
            raise ValueError(f"Empty Latent Advanced: unknown Mode: {Mode}")

        # Flux 2 requires dimensions divisible by 16. Return the ACTUAL sizes
        # used to create the latent, so downstream scheduler/conditioning matches.
        width = self._align(width, downscale)
        height = self._align(height, downscale)
        latent = torch.zeros(
            (batch_size, channels, height // downscale, width // downscale),
            dtype=torch.float32,
            device="cpu",
        )
        return ({"samples": latent}, width, height)


NODE_CLASS_MAPPINGS = {
    "EmptyLatentAdvancedSelector": EmptyLatentAdvancedSelector,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "EmptyLatentAdvancedSelector": "📐 Empty Latent Advanced",
}

WEB_DIRECTORY = "./js"
