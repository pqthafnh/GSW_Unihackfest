/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/escrow.json`.
 */
export type Escrow = {
  "address": "FgSE7P55TqSMW6RciDmzLuq3ti2YWrSc96p9WsEx7zr8",
  "metadata": {
    "name": "escrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Native SOL escrow for Micro-Gig Network (Devnet only)"
  },
  "instructions": [
    {
      "name": "approveRelease",
      "discriminator": [
        110,
        173,
        58,
        175,
        146,
        128,
        138,
        255
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "client",
          "signer": true,
          "relations": [
            "escrow"
          ]
        },
        {
          "name": "worker",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "assignWorker",
      "discriminator": [
        87,
        60,
        234,
        136,
        96,
        231,
        51,
        189
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "client",
          "signer": true,
          "relations": [
            "escrow"
          ]
        }
      ],
      "args": [
        {
          "name": "worker",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "fundNativeSol",
      "discriminator": [
        23,
        40,
        125,
        126,
        155,
        18,
        114,
        131
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "client",
          "writable": true,
          "signer": true,
          "relations": [
            "escrow"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury"
        },
        {
          "name": "arbiter"
        },
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializeEscrow",
      "discriminator": [
        243,
        160,
        77,
        153,
        11,
        92,
        48,
        209
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "gigDigest"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gigDigest",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "termsHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "openDispute",
      "discriminator": [
        137,
        25,
        99,
        119,
        23,
        223,
        161,
        42
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "opener",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "recordSubmission",
      "discriminator": [
        241,
        159,
        132,
        217,
        196,
        63,
        96,
        200
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "worker",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "submissionHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "refundPreAssignment",
      "discriminator": [
        91,
        112,
        118,
        51,
        91,
        251,
        83,
        69
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "client",
          "writable": true,
          "signer": true,
          "relations": [
            "escrow"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "requestRevision",
      "discriminator": [
        205,
        195,
        75,
        171,
        242,
        149,
        90,
        14
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "client",
          "signer": true,
          "relations": [
            "escrow"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setPaused",
      "discriminator": [
        91,
        60,
        125,
        192,
        176,
        225,
        166,
        218
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateArbiter",
      "discriminator": [
        186,
        0,
        245,
        142,
        77,
        0,
        165,
        210
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "arbiter",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateFee",
      "discriminator": [
        232,
        253,
        195,
        247,
        148,
        212,
        73,
        222
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "feeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateTreasury",
      "discriminator": [
        60,
        16,
        243,
        66,
        96,
        59,
        254,
        131
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    },
    {
      "name": "platformConfig",
      "discriminator": [
        160,
        78,
        128,
        0,
        248,
        83,
        230,
        160
      ]
    }
  ],
  "events": [
    {
      "name": "configInitialized",
      "discriminator": [
        181,
        49,
        200,
        156,
        19,
        167,
        178,
        91
      ]
    },
    {
      "name": "disputeOpened",
      "discriminator": [
        239,
        222,
        102,
        235,
        193,
        85,
        1,
        214
      ]
    },
    {
      "name": "escrowFunded",
      "discriminator": [
        228,
        243,
        166,
        74,
        22,
        167,
        157,
        244
      ]
    },
    {
      "name": "escrowInitialized",
      "discriminator": [
        222,
        186,
        157,
        47,
        145,
        142,
        176,
        248
      ]
    },
    {
      "name": "feeUpdated",
      "discriminator": [
        228,
        75,
        43,
        103,
        9,
        196,
        182,
        4
      ]
    },
    {
      "name": "pauseChanged",
      "discriminator": [
        238,
        188,
        213,
        78,
        134,
        209,
        178,
        218
      ]
    },
    {
      "name": "refunded",
      "discriminator": [
        35,
        103,
        149,
        246,
        196,
        123,
        221,
        99
      ]
    },
    {
      "name": "releaseApproved",
      "discriminator": [
        246,
        7,
        17,
        99,
        160,
        10,
        151,
        253
      ]
    },
    {
      "name": "revisionRequested",
      "discriminator": [
        14,
        182,
        180,
        102,
        103,
        151,
        201,
        29
      ]
    },
    {
      "name": "submissionRecorded",
      "discriminator": [
        35,
        24,
        63,
        154,
        131,
        209,
        171,
        62
      ]
    },
    {
      "name": "workerAssigned",
      "discriminator": [
        34,
        192,
        54,
        119,
        86,
        29,
        3,
        31
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "feeTooHigh",
      "msg": "Fee exceeds the configured maximum"
    },
    {
      "code": 6001,
      "name": "paused",
      "msg": "Escrow is paused"
    },
    {
      "code": 6002,
      "name": "invalidAmount",
      "msg": "Amount must be positive"
    },
    {
      "code": 6003,
      "name": "alreadyFunded",
      "msg": "Escrow is already funded"
    },
    {
      "code": 6004,
      "name": "notFunded",
      "msg": "Escrow is not funded"
    },
    {
      "code": 6005,
      "name": "invalidState",
      "msg": "Invalid escrow state"
    },
    {
      "code": 6006,
      "name": "workerMissing",
      "msg": "Worker is missing"
    },
    {
      "code": 6007,
      "name": "wrongWorker",
      "msg": "Worker does not match escrow"
    },
    {
      "code": 6008,
      "name": "wrongTreasury",
      "msg": "Treasury does not match config"
    },
    {
      "code": 6009,
      "name": "alreadyAssigned",
      "msg": "Escrow is already assigned"
    },
    {
      "code": 6010,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6011,
      "name": "unauthorized",
      "msg": "Signer is not authorized for this escrow"
    },
    {
      "code": 6012,
      "name": "invalidWorker",
      "msg": "Worker must be a non-zero key"
    },
    {
      "code": 6013,
      "name": "selfDealing",
      "msg": "Client cannot assign themselves as worker"
    },
    {
      "code": 6014,
      "name": "emptySubmissionHash",
      "msg": "Submission hash must not be all zeroes"
    }
  ],
  "types": [
    {
      "name": "configInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "disputeOpened",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "opener",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "worker",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "gigDigest",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "termsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "arbiter",
            "type": "pubkey"
          },
          {
            "name": "funded",
            "type": "bool"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "escrowState"
              }
            }
          },
          {
            "name": "submissionHash",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "submissionVersion",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "escrowFunded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "escrowInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "escrowState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "created"
          },
          {
            "name": "funded"
          },
          {
            "name": "assigned"
          },
          {
            "name": "submitted"
          },
          {
            "name": "revisionRequested"
          },
          {
            "name": "disputed"
          },
          {
            "name": "released"
          },
          {
            "name": "refunded"
          }
        ]
      }
    },
    {
      "name": "feeUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "pauseChanged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "arbiter",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "paused",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "refunded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "releaseApproved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "worker",
            "type": "pubkey"
          },
          {
            "name": "payout",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "revisionRequested",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "submissionRecorded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "submissionHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "version",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "workerAssigned",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "worker",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
