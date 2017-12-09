from Crypto.PublicKey import RSA
import binascii
import sys

private = RSA.generate(2048)
public = private.publickey()

privkey = private.exportKey()
pubkey = public.exportKey()


privFile = open("../keys/privateChatKey.pem", "w+")
privFile.write(privkey.decode("utf-8", "strict"))

pubFile = open("../keys/publicChatKey.pem", "w+")
pubFile.write(pubkey.decode("utf-8", "strict"))

print(pubkey.decode("utf-8", "strict"))
sys.stdout.flush()