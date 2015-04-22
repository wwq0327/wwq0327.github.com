#!/usr/bin/env python3
# -*- utf-8 -*-

"""
create a template to jekyll
usage: jekyll_post title

"""

__version__ = "0.01"
__author__ = "wwq0327@gmail.com"

import os
import sys

from datetime import datetime

SAVE_DIR = "_posts"
HEADER = """---
layout: post
title: 
description:
keywords:
---"""

def gen_title(title):
    date_string = datetime.today().strftime("%Y-%m-%d")
    return date_string + "-" + title + ".markdown"


def save(filename):
    save_path = os.path.join(SAVE_DIR, filename)
    if os.path.exists(save_path):
        print("%s is exists." % filename)
        sys.exit(1)
        
    print(save_path)
    try:
        f = open(save_path, "w")
        f.write(HEADER)
    except IOError as e:
        print(e.strerror)
        sys.exit(0)

    f.close()

def main():
    if len(sys.argv) == 2:
        filename = gen_title(sys.argv[1])
        
        save(filename)
    else:
        print(__doc__)

if __name__ == '__main__':

    main()
