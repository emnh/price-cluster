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
import json
from pyppeteer import launch
from bs4 import BeautifulSoup
from pprint import pprint
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def main():
    bigdict = {}
    vectorSuperSet = set()
    names = []
    maximums = {}
    infodicts = []
    numdicts = []
    vectors = []
    for name in os.listdir('products'):
        if 'e=' in name:
            fpath = os.path.join('products', name)
            info = {}
            with open(fpath, 'r') as fd:
                data = fd.read()
                soup = BeautifulSoup(data)

                cls = 'test'
                for div in soup.find_all('div'):
                    if div.text == 'Produktvekt':
                        #print(div['class'])
                        cls = div['class']
                    if 'class' in div.attrs:
                        #print(div['class'])
                        if 'TabLowestPrice' in ' '.join(div['class']):
                            info['LavestePris'] = ''.join(re.findall('[0-9\.]*', div.text)) + ' kr'
                            #print(div.text)
                            #print(div.text.replace('&nbsp;', ' '))
                key = None
                for div in soup.find_all('div', { 'class': cls }):
                    if key == None:
                        key = div.text
                    else:
                        info[key] = div.text
                        key = None

            if 'Produktnavn' in info:
                prodname = info['Produktnavn']
                names.append(prodname)
                #print(prodname)
                #pprint(info)
                numinfo = {}
                infodicts.append(info)
                for key, value in info.items():
                    m = re.findall('^[0-9\.]+', value)
                    if m:
                        numinfo[key] = float(m[0])
                vectorSuperSet |= numinfo.keys()
                numdicts.append(numinfo)
                for k, v in numinfo.items():
                    if not k in maximums:
                        maximums[k] = v
                    else:
                        maximums[k] = max(maximums[k], v)
                    bkey = k + ': ' + str(v)
                    if not bkey in bigdict:
                        bigdict[bkey] = []
                    bigdict[bkey].append(prodname)
                #pprint(numinfo)
    for numdict in numdicts:
        vec = [0.0 for x in range(len(vectorSuperSet))]
        for i, key in enumerate(vectorSuperSet):
            if key in numdict:
                vec[i] = numdict[key] / maximums[k]
        vectors.append(vec)
    X = np.array([np.array(x) for x in vectors])
    pca = PCA(n_components=2)
    pca.fit(X)
    Y = pca.transform(X)
    #pprint(X.shape)
    #print(pca.singular_values_.shape)
    #print(pca.singular_values_)
    svd = Y
    jsondict2 = []
    def scaled(x):
        s = {}
        for k, v in x.items():
            s[k] = v / maximums[k]
        return s

    for name, numdict, vector, svdElement, infodict in zip(names, numdicts, vectors, svd, infodicts):
        jsondict2.append({
            'name': name,
            'numdict': numdict,
            'scalednumdict': scaled(numdict),
            'infodict': infodict,
            'vector': vector,
            'svdx': svdElement[0],
            'svdy': svdElement[1]
        })
    jsondata = json.dumps(jsondict2, indent=2)
    print(jsondata)

    #print(vectors)
    #kmeans = KMeans(n_clusters=2, random_state=0).fit(X)
    #kmeans.labels_

#     print('digraph G {')
#     for k, vs in bigdict.items():
#         if len(vs) > 50:
#             for v in vs:
#                 k = k.replace('"', '')
#                 v = v.replace('"', '')
#                 print('"' + k + '"', '<-', '"' + v + '"', ';')
#     print('}')

if __name__ == '__main__':
    main()
