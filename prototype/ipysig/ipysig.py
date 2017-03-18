# prototype API for IPySig networkx-sigmajs app

from __future__ import print_function
from __future__ import division

import os
import sys
import re
import shutil as shl

import subprocess as sbp
import threading

import collections as coll  # not sure if this one is needed

#traitlets to enforce strongly typed keys and bools? -- pip install traitlets
# from traitlets import Bool, String

import networkx as nx

class IpySigException(Exception):
    '''
    Base class for all module related Exceptions
    '''
    pass

###

class IPySig(object):
    '''
    Main graph object
    '''
    _store = {}  # store all instances keyed by name
    url = None          # url and token of currently running notebook server
    token = None
    express_process = None   # the express process

    def __init__(self, graph, name):
        self.name = name
        self.graph = None

        self._load_graph(graph)  # all of these need to pass error checking before continuing
        self._load_ref()

        if IPySig.url is None:
            self._get_url_oneserver()

        self._init_express() # threading and subprocess calls run_node if subprocess not running

    def _load_graph(self, g):
        self.graph = g    # needs wrapper to perform error check

    def _load_ref(self):
        IPySig._store[self.name] = self   # load instance of self into _store{}
                                          # needs wrapper to perform error check

    #Anything node interacts with for IPySig objects must be a class method
    #class methods to help interact with globals: store{}, url, and token

    @classmethod
    def get_store(cls):
        return cls._store

    @classmethod
    def get_ref(cls, name):
        return cls._store[name]

    @classmethod
    def get_url(cls):
        return cls.url

    @classmethod
    def get_token(cls):
        return cls.token

    def _get_url_oneserver(self):
        # gets url and token if any and sets them... run once - need to error check here
        # current implementation hard coded to work with only one running server
        out = sbp.check_output(['jupyter','notebook','list']).split('\n')[1].split(' ')[0]  # pulls out single url
        IPySig.url = re.match(r'http://.+/',out).group()
        token = re.search(r'(?<=token=).+',out)

        if token:
            IPySig.token = token.group()


    def _init_express(self):
        # checks to see if subprocess is already running and then calls the express app on a thread using _run_node()
        pass

    def _run_node(self):
        # Run the node script with command arguments for baseUrl and token
        #
        node_command = ['node', '../app/index.js', '--baseUrl', IPySig.base_url]
        if token:
            node_command.append('--token={}'.format(IPySig.token)) # attach if running notebook has token (4.2.3+)

        print(' '.join(node_command))
        return subprocess.check_call(node_command)



if __name__ == '__main__':
    pass
    g = nx.Graph()

    x = IPySig(g, 'fred')
