#!/usr/bin/env python
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import argparse
import argostranslate.package

def install_local_models(models_dir):
    for model_file in os.listdir(models_dir):
        if model_file.endswith('.argosmodel'):
            model_path = os.path.join(models_dir, model_file)
            print(f"Installing local model: {model_file}")
            argostranslate.package.install_from_path(model_path)

from libretranslate.init import check_and_install_models

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--load_only_lang_codes", type=str, default="")
    parser.add_argument("--update", action='store_true')
    args = parser.parse_args()
    lang_codes = args.load_only_lang_codes.split(",")
    if len(lang_codes) == 0 or lang_codes[0] == '':
        lang_codes = None

    # 添加对本地模型的支持
    local_models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    if os.path.exists(local_models_dir):
        install_local_models(local_models_dir)

    if args.update:
        check_and_install_models(update=True, load_only_lang_codes=lang_codes)
    else:
        check_and_install_models(force=True, load_only_lang_codes=lang_codes)
