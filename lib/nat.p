def Z = \z s. z
def S = \n z s. s (n z s)
def cataNat = \n z s. n z s
def addNat = \a b. cataNat a b S
