#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: ft=python ts=4 sw=4 sts=4 et fenc=utf-8
# Original author: "Eivind Magnus Hvidevold" <hvidevold@gmail.com>
# License: GNU GPLv3 at http://www.gnu.org/licenses/gpl.html

'''
'''

import os
import sys
import re
import time
import urllib.request
import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup

def main():
    for name in os.listdir('data'):
        fpath = os.path.join('data', name)
        with open(fpath, 'r') as fd:
            data = fd.read()
            soup = BeautifulSoup(data)
            for a in soup.find_all('a'):
                print(a)

if __name__ == '__main__':
    main()
